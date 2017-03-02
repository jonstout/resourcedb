#--------------------------------------------------------------------
#----- GRNOC NetSage ResourceDB DataService Library
#-----
#----- Copyright(C) 2017 The Trustees of Indiana University
#--------------------------------------------------------------------
#----- This module contains the functionality to connect to and query
#----- the backend database.  It contains methods that are used as
#----- callbacks for the DataService/GWS.pm library.
#--------------------------------------------------------------------

package GRNOC::NetSage::ResourceDB::DataService;

use strict;
use warnings;

use GRNOC::Config;
use GRNOC::DatabaseQuery;
use GRNOC::WebService::Client;
use GRNOC::MetaParameter;
use GRNOC::MetaParameter::OrderBy;
use GRNOC::NetSage::ResourceDB::DataService::Result;

use String::MkPasswd qw( mkpasswd );
use MIME::Lite::TT;
use Data::Dumper;
use Time::HiRes;

use constant SERVICE_CACHE_FILE => '/etc/grnoc/name-service-cacher/name-service.xml';
use constant COOKIE_FILE => '/tmp/netsage_resourcedb_cookies';

use constant VALID_DYNAMIC_DB_NAMES => {
    'role' => 1,
    'organization' => 1,
    'project' => 1,
    'discipline' => 1
};

### constructor ###

sub new {

    my $caller = shift;

    my $class = ref( $caller );
    $class = $caller if ( !$class );

    my $self = {'config_file' => undef,
                'error' => undef,
                @_};

    bless( $self, $class );

    # parse config, setup database connections, etc.
    $self->_init();

    return $self;
}

### getters/setters ###

sub config {

    my ( $self, $config ) = @_;

    $self->{'config'} = $config if ( defined( $config ) );

    return $self->{'config'};
}

sub dbq_ro {

    my ( $self, $dbq_ro ) = @_;

    $self->{'dbq_ro'} = $dbq_ro if ( defined( $dbq_ro ) );

    return $self->{'dbq_ro'};
}

sub dbq_rw {

    my ( $self, $dbq_rw ) = @_;

    $self->{'dbq_rw'} = $dbq_rw if ( defined( $dbq_rw ) );

    return $self->{'dbq_rw'};
}

sub clouds {
    my ( $self, $clouds ) = @_;

    $self->{'clouds'} = $clouds if (defined $clouds);

    return $self->{'clouds'};
}

sub cache {
    my ( $self, $cache ) = @_;

    $self->{'cache'} = $cache if (defined $cache);

    return $self->{'cache'};
}

sub webservice_client {
    my ( $self, $client ) = @_;

    $self->{'client'} = $client if (defined $client);

    return $self->{'client'};
}

sub config_data {
    my ( $self, $config_data ) = @_;

    $self->{'config_data'} = $config_data if (defined $config_data);

    return $self->{'config_data'};
}

sub error {

    my ( $self, $error ) = @_;

    $self->{'error'} = $error if ( defined( $error ) );

    return $self->{'error'};
}

# just a getter
sub valid_dynamic_db_names {
    my $self = shift;

    return VALID_DYNAMIC_DB_NAMES();

}


sub format_find {
    my ($self, %args) = @_;
    my $find        = $args{'find'} || {};
    my $find_logic  = $args{'find_logic'} || '$and';
    my $field_logic = $args{'field_logic'} || '$or';
    my $field       = $args{'field'};
    my $values      = $args{'values'};

    if(!defined($values)){
        return $find;
    }

    if(!defined($find->{$find_logic})){
        $find->{$find_logic} = [];
    }

    my $formatted_values = { $field_logic => [] };
    foreach my $value (@$values){
        push(@{$formatted_values->{$field_logic}}, { $field => $value});
    }
    push(@{$find->{$find_logic}}, $formatted_values);

    return $find;
}

### public methods ###

sub get_table_dynamically {

    my ( $self, $name, %args ) = @_;

    if ( !$self->_is_dbname_valid( $name ) ) {
        $self->error( "Invalid db name specified: $name" );
        return;
    }

    my $remote_user = $args{'remote_user'};

    my $select_fields = ["${name}.${name}_id",
                         "$name.name",
                         ];

    my @where = ();

    # handle optional role_id param
    my $id_param = GRNOC::MetaParameter->new( name => "${name}_id",
                                              field => "${name}.${name}_id" );

    @where = $id_param->process( args => \%args,
                                 where => \@where );

    # get the order_by value
    my $order_by_param = GRNOC::MetaParameter::OrderBy->new();
    my $order_by = $order_by_param->parse( %args );

    my $limit = $args{'limit'};
    my $offset = $args{'offset'};

    my $from_sql = "$name ";

    my $results = $self->dbq_rw()->select( table => $from_sql,
                                           fields => $select_fields,
                                           where => [-and => \@where],
                                           order_by => $order_by,
                                           limit => $limit,
                                           offset => $offset );

    if ( !$results ) {

        $self->error( "An unknown error occurred getting the ${name}s" );
        return;
    }

    my $num_rows = $self->dbq_rw()->num_rows();

    my $result = GRNOC::NetSage::ResourceDB::DataService::Result->new( results => $results,
                                                                 total => $num_rows,
                                                                 offset => $offset );

    return $result;

}

sub add_table_dynamically {

    my ( $self, $name, %args ) = @_;

    if ( !$self->_is_dbname_valid( $name ) ) {
        $self->error( "Invalid db name specified: $name" );
        return;
    }

    my $remote_user = $args{'remote_user'};

    my $from_sql = "$name ";

    my $name_val = $args{'name'};

    my $results = $self->dbq_rw()->insert( table => $from_sql,
                                           fields => {
                                              'name' => $name_val
                                           }
                                         );

    if ( !$results ) {

        $self->error( "An unknown error occurred inserting the ${name}" );
        return;
    }

    #my $result = GRNOC::NetSage::ResourceDB::DataService::Result->new( results => $results,
    #                                                             total => $num_rows,
    #                                                             );

    return [{ "${name}_id" => $results }];

}

sub update_table_dynamically {

    my ( $self, $name, %args ) = @_;

    if ( !$self->_is_dbname_valid( $name ) ) {
        $self->error( "Invalid db name specified: $name" );
        return;
    }

    my $remote_user = $args{'remote_user'};

    # handle required ${name}_id param
    my $id_param = GRNOC::MetaParameter->new( name => "${name}_id",
                                              field => "${name}_id" );

    my @where = ();

    @where = $id_param->process( args => \%args,
                                      where => \@where );

    my $from_sql = "$name ";

    my $name_val = $args{'name'};

    my %fields = (
        'name' => $name_val,
    );

    my $results = $self->dbq_rw()->update( table => $from_sql,
                                           fields => \%fields,
                                           where => [-and => \@where],
                                         );

    if ( !$results ) {

        $self->error( "An unknown error occurred updating the ${name}" );
        return;
    }

    if ( $results == 0 ) {
        $self->error( "No rows affected" );
        return;
    }

    return [{ "${name}_id" => $args{"${name}_id"} }];

}

sub delete_table_dynamically {

    my ( $self, $name, %args ) = @_;

    if ( !$self->_is_dbname_valid( $name ) ) {
        $self->error( "Invalid db name specified: $name" );
        return;
    }

    my $remote_user = $args{'remote_user'};

    # handle required ${name}_id param
    my $id_param = GRNOC::MetaParameter->new( name => "${name}_id",
                                              field => "${name}_id" );

    my @where = ();

    @where = $id_param->process( args => \%args,
                                      where => \@where );

    my $from_sql = "$name ";

    my $results = $self->dbq_rw()->delete( table => $from_sql,
                                           where => [-and => \@where],
                                         );

    if ( !$results ) {

        $self->error( "An unknown error occurred deleting the ${name}" );
        return;
    }

    if ( $results == 0 ) {
        $self->error( "No rows affected" );
        return;
    }

    return [{ "${name}_id" => $args{"${name}_id"} }];

}

### private methods ###

sub _is_dbname_valid {
    my ( $self, $name ) = @_;
    if ( exists ${ VALID_DYNAMIC_DB_NAMES() }{$name}  ) {
        return 1;
    }
    return 0;
}

sub _init {

    my ( $self ) = @_;

    # first parse and store the config file
    my $config = GRNOC::Config->new( config_file => $self->{'config_file'},
        force_array => 0 );

    if ( !defined( $config ) ) {

        $self->error( 'Unable to parse the config file.' );
        return;
    }

    $self->config( $config );

    # create the database handles
    my $dbq_ro = GRNOC::DatabaseQuery->new( name  => $config->get( '/config/database-name' ),
        user  => $config->get( '/config/database-readonly-username' ),
        pass  => $config->get( '/config/database-readonly-password' ),
        srv   => $config->get( '/config/database-host' ),
        port  => $config->get( '/config/database-port' ),
        debug => $config->get( '/config/database-query-debug' ) );

    my $ret = $dbq_ro->connect();

    if ( !$ret ) {

        $self->error( 'Unable to connect to the database using read-only credentials.' );
        return;
    }

    my $dbq_rw = GRNOC::DatabaseQuery->new( name  => $config->get( '/config/database-name' ),
        user  => $config->get( '/config/database-readwrite-username' ),
        pass  => $config->get( '/config/database-readwrite-password' ),
        srv   => $config->get( '/config/database-host' ),
        port  => $config->get( '/config/database-port' ),
        debug => $config->get( '/config/database-query-debug' ) );

    $ret = $dbq_rw->connect();

    if ( !$ret ) {

        $self->error( 'Unable to connect to the database using read-write credentials.' );
        return;
    }

    $self->dbq_ro( $dbq_ro );
    $self->dbq_rw( $dbq_rw );

    return 1;
}


1;
