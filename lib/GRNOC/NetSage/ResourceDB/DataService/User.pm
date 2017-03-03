package GRNOC::NetSage::ResourceDB::DataService::User;

use strict;
use warnings;

use GRNOC::Config;
use GRNOC::DatabaseQuery;

use Data::Dumper;

use base 'GRNOC::NetSage::ResourceDB::DataService';

my $singleton;

### constructor ###
sub new {

    my $caller = shift;

    my $class = ref( $caller );
    $class = $caller if ( !$class );

    # if we've created this object (singleton) before, just return it
    return $singleton if ( defined( $singleton ) );

    my $self = $class->SUPER::new( @_ );

    bless( $self, $class );

    # store our newly created object as the singleton
    $singleton = $self;

    my $config = GRNOC::Config->new( config_file => $self->{'config_file'}, force_array => 0);
    $self->{'config'} = $config;

    return $self;
}

sub get_ip_blocks {

    my ( $self, %args ) = @_;

    my $remote_user = $args{'remote_user'};

    my $select_fields = [
                         'ip_block.ip_block_id as ip_block_id',
                         'ip_block.name as name',
                         'ip_block.addr_str as addr_str',
                         'ip_block.addr_lower as addr_lower',
                         'ip_block.addr_upper as addr_upper',
                         'ip_block.mask as mask',
                         'ip_block.asn as asn',
                         'ip_block.organization_id as organization_id',
                         'ip_block.country_code as country_code',
                         'ip_block.country_name as country_name',
                         'ip_block.continent_code as continent_code',
                         'ip_block.continent_name as continent_name',
                         'ip_block.postal_code as postal_code',
                         'ip_block.latitude as latitude',
                         'ip_block.longitude as longitude',
                         'ip_block.project_id as project_id',
                         'ip_block.discipline_id as discipline_id',
                         'ip_block.role_id as role_id',
                         'role.name as role_name',
                         'organization.name as organization_name',
                         'project.name as project_name',
                         'discipline.name as discipline_name',
                         ];

    my @where = ();

    # handle optional ip_block_id param
    my $role_id_param = GRNOC::MetaParameter->new( name => 'ip_block_id',
                                                   field => 'ip_block.ip_block_id' );

    @where = $role_id_param->process( args => \%args,
                                      where => \@where );

    # get the order_by value
    my $order_by_param = GRNOC::MetaParameter::OrderBy->new();
    my $order_by = $order_by_param->parse( %args );

    my $limit = $args{'limit'};
    my $offset = $args{'offset'};

    my $from_sql = 'ip_block ';
    $from_sql .= 'left join organization on ( ip_block.organization_id = organization.organization_id ) ';
    $from_sql .= 'left join role on ( ip_block.role_id = role.role_id ) ';
    $from_sql .= 'left join discipline on ( ip_block.discipline_id = discipline.discipline_id ) ';
    $from_sql .= 'left join project on ( ip_block.project_id = project.project_id ) ';

    my $results = $self->dbq_ro()->select( table => $from_sql,
                                           fields => $select_fields,
                                           where => [-and => \@where],
                                           order_by => $order_by,
                                           limit => $limit,
                                           offset => $offset );

    if ( !$results ) {

        $self->error( 'An unknown error occurred getting the ip blocks.' );
        return;
    }

    my $num_rows = $self->dbq_ro()->num_rows();

    my $result = GRNOC::NetSage::ResourceDB::DataService::Result->new( results => $results,
                                                                 total => $num_rows,
                                                                 offset => $offset );

    return $result;

}

1;
