import pandas
import sys
import hashlib
from requests.auth import HTTPDigestAuth

test_mode = False
clear_mode = False
REGION_PREFIX = '_R1_'
DISTRICT_PREFIX = '_D2_'
WARD_PREFIX = '_W3_'
VILLAGE_PREFIX = '_V4_'


if len(sys.argv) >= 2:
    if sys.argv[1] == 'test':
        test_mode = True
    elif sys.argv[1] == 'clear':
        clear_mode = True

df = pandas.read_csv('app/config/assets/csv/geo_unit.csv')

regions = df['region'].unique()

ldap_out = open("ldap_output.ldif", "w+")
eid = 0
for region in regions:
    out = '#Entry ' + str(eid) + ': ou=' + region + ',ou=default_prefix,ou=groups,dc=example,dc=org\n'
    ldap_out.write(out)
    out = 'dn: ou=' + region + ',ou=default_prefix,ou=groups,dc=example,dc=org\n'
    ldap_out.write(out)
    out = 'objectclass: organizationalUnit\n'
    ldap_out.write(out)
    out = 'objectclass: top\n'
    ldap_out.write(out)
    out = 'ou: ' + region + '\n'
    ldap_out.write(out)
    ldap_out.write('\n')
    eid += 1

reg_dist = df.groupby(['region', 'district']).groups
for region, district in reg_dist.keys():
    out = '#Entry ' + str(eid) + ': ou=' + district + ',ou=' + region + ',ou=default_prefix,ou=groups,dc=example,dc=org\n'
    ldap_out.write(out)
    out = 'dn: ou=' + district + ',ou=' + region + ',ou=default_prefix,ou=groups,dc=example,dc=org\n'
    ldap_out.write(out)
    out = 'objectclass: organizationalUnit\n'
    ldap_out.write(out)
    out = 'objectclass: top\n'
    ldap_out.write(out)
    out = 'ou: ' + district + '\n'
    ldap_out.write(out)
    ldap_out.write('\n')
    eid += 1

reg_dist_ward = df.groupby(['region', 'district', 'ward']).groups
for region, district, ward in reg_dist_ward.keys():
    out = '#Entry ' + str(eid) + ': ou=' + ward + ',ou=' + district + ',ou=' + region + ',ou=default_prefix,ou=groups,dc=example,dc=org\n'
    ldap_out.write(out)
    out = 'dn: ou=' + ward + ',ou=' + district + ',ou=' + region + ',ou=default_prefix,ou=groups,dc=example,dc=org\n'
    ldap_out.write(out)
    out = 'objectclass: organizationalUnit\n'
    ldap_out.write(out)
    out = 'objectclass: top\n'
    ldap_out.write(out)
    out = 'ou: ' + ward + '\n'
    ldap_out.write(out)
    ldap_out.write('\n')
    eid += 1

gid = 601
reg_dist_ward_vil = df.groupby(['region', 'district', 'ward', 'village']).groups
for region, district, ward, village in reg_dist_ward_vil.keys():
    if pandas.isnull(village):
        continue
    out = '#Entry ' + str(eid) + ': gidNumber=' + str(gid) + ',ou=' + ward + ',ou=' + district + ',ou=' + region + ',ou=default_prefix,ou=groups,dc=example,dc=org\n'
    ldap_out.write(out)
    out = 'dn: gidNumber=' + str(gid) + ',ou=' + ward + ',ou=' + district + ',ou=' + region + ',ou=default_prefix,ou=groups,dc=example,dc=org\n'
    ldap_out.write(out)
    out = 'cn: default_prefix ' + REGION_PREFIX + region + DISTRICT_PREFIX + district + WARD_PREFIX + ward + VILLAGE_PREFIX + village + '\n'
    ldap_out.write(out)
    out = 'description: ' + village + '\n'
    ldap_out.write(out)
    out = 'gidnumber: ' + str(gid) + '\n'
    ldap_out.write(out)
    out = 'objectclass: posixGroup\n'
    ldap_out.write(out)
    out = 'objectclass: top\n'
    ldap_out.write(out)
    ldap_out.write('\n')
    gid += 1
    eid += 1

