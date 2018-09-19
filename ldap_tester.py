import hashlib
from requests.auth import HTTPDigestAuth


url = 'http://128.208.4.23/odktables/default/privilegesInfo'
response = requests.get(url, auth=HTTPBasicAuth('clarice', 'clarice'))
content = response.content

code = response.status_code

# decode to string
decoded_content = content.decode("utf-8")

# Make it json
json_content = json.loads(decoded_content)

# retrieve object
json_content["defaultGroup"]

vil = df.groupby(['region', 'district', 'ward', 'village'])

pd.concat(g for _, g in df.groupby("ID") if len(g) > 1)

if clear_mode:
    # Delete test users
    # Entry 502: uid=clarice,ou=people,dc=example,dc=org
    dn: uid = clarice, ou = people, dc = example, dc = org
    cn: clarice
    gidnumber: 501
    homedirectory: / home / users / clarice
    objectclass: inetOrgPerson
    objectclass: posixAccount
    objectclass: top
    sn: clarice
    uid: clarice
    uidnumber: 1001
    userpassword: {MD5}
    cctCsn8HcdEEblMSSrSFAQ ==

df[df.duplicated(keep=False)]


