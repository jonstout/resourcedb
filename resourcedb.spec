Summary:   NetSage Resource Database
Name:      resourcedb
Version:   0.0.1
Release:   %{_buildno}%{?dist}
License:   Apache
Group:     GRNOC
URL:       http://globalnoc.iu.edu
Source:    %{name}-%{version}.tar.gz

BuildArch: noarch
BuildRoot: %(mktemp -ud %{_tmppath}/%{name}-%{version}-%{release}-XXXXXX)

BuildRequires: perl
BuildRequires: httpd-devel
BuildRequires: mod_perl-devel

Requires: mariadb
Requires: mariadb-server
Requires: perl-DBD-MySQL

%description
NetSage Resource Database (Science Registry)

%prep
%setup -q -n resourcedb-%{version}

%build
%{__perl} Makefile.PL PREFIX="%{buildroot}%{_prefix}" INSTALLDIRS="vendor"

%install
# HTTP and web files
%{__install} -d -p %{buildroot}%{_datadir}/resourcedb/www/static

cp -ar www/static/* %{buildroot}%{_datadir}/resourcedb/www/static

# Configuration and schema files
%{__install} -d -p %{buildroot}%{_sysconfdir}/grnoc/resourcedb

%{__install} -m 544 sql/resourcedb.sql %{buildroot}%{_sysconfdir}/grnoc/resourcedb

# Executables
%{__install} -d -p %{buildroot}%{_bindir}/grnoc/resourcedb

%{__install} -m 544 bin/resourcedb-init-db %{buildroot}%{_bindir}

#%check
#make test_jenkins

%clean
rm -rf $RPM_BUILD_ROOT

%files
%{_datadir}/resourcedb/www/static/
%{_sysconfdir}/grnoc/resourcedb/resourcedb.sql
%{_bindir}/resourcedb-init-db
