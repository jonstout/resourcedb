package GRNOC::NetSage::ResourceDB::GWS::Admin;

use strict;
use warnings;

use GRNOC::Config;
use GRNOC::DatabaseQuery;
use GRNOC::WebService::Method;
use GRNOC::WebService::Regex;
use GRNOC::NetSage::ResourceDB::DataService::Admin;

use Data::Dumper;

our $websvc;

use base 'GRNOC::NetSage::ResourceDB::GWS';

sub new {

    my $caller = shift;

    my $class = ref( $caller );
    $class = $caller if ( !$class );

    my $self = $class->SUPER::new( @_ );

    bless( $self, $class );


    return $self;
}

sub _init_add_methods {

    my $self = shift;
    #my $method_in = shift;
    #my $args = shift;

    my $method;

    $self->valid_dynamic_db_names( $self->user_ds()->valid_dynamic_db_names() );

    $self->_init_dynamic_add_methods( @_ );


    # add_ip_blocks
    $method = GRNOC::WebService::Method->new( name => 'add_ip_blocks',
                                                   description => "Adds the specified IP blocks.",
                                                   expires => "-1d",
                                                   #default_order_by => ['name'],
                                                   callback => sub { $self->_add_ip_blocks( @_ ) } );

    # add the optional 'ip_block_id' input param to the get_ip_blocks() method
    $method->add_input_parameter( name        => 'ip_block_id',
                                  pattern     => $INTEGER,
                                  required    => 0,
                                  multiple    => 1,
                                  description => 'The id of the IP block');

    $self->websvc()->register_method( $method );



}

sub _init_dynamic_add_methods {
    #my ( $self, $method_in, $args ) = @_;
    my $self = shift;
    #my $method_in = shift;
    #my $args = shift;

    foreach my $name ( keys %{ $self->valid_dynamic_db_names() } ) {
        my $method;
        # get_roles
        $method = GRNOC::WebService::Method->new( name => "add_${name}s",
            description => "Adds the ${name}",
            expires => "-1d",
            #default_order_by => ['name'],
            callback => sub { $self->_add_table_dynamically( $name, @_ ) } );
        #callback => sub { $self->_add_table_dynamically( $name, $method_in, $args ) } );

        # add the optional 'role_id' input param to the get_roles() method
        $method->add_input_parameter( 
            name        => 'name',
            pattern     => $TEXT,
            required    => 1,
            multiple    => 0,
            description => "The name of the $name");

        $self->websvc()->register_method( $method );



    }


}


### callbacks ###

sub _add_table_dynamically {

    my ( $self, $name, $method, $args ) = @_;

    my $result = $self->admin_ds()->add_table_dynamically( $name, $self->process_args( $args ) );

    # handle error
    if ( !$result ) {

        $method->set_error( $self->admin_ds()->error() );
        return;
    }

    return {'results' => $result->results(),
            'total' => $result->total(),
            'warning' => $result->warning()};
}


sub _get_ip_blocks {

    my ( $self, $method, $args ) = @_;

    my $result = $self->user_ds()->get_ip_blocks( $self->process_args( $args ) );

    # handle error
    if ( !$result ) {

        $method->set_error( $self->user_ds()->error() );
        return;
    }

    return {'results' => $result->results(),
            'total' => $result->total(),
            'offset' => $result->offset(),
            'warning' => $result->warning()};
}


1;

