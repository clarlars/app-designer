import csv, re

with open('app/config/assets/csv/geo_unit.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    bad_char_line_count = 0
    for row in csv_reader:
        if line_count == 0:
            print('Column names are {}'.format({", ".join(row)}))
        else:
            if re.match("^[A-Z0-9_]*$", row[0]) is None or re.match("^[A-Z0-9_]*$", row[1]) is None \
               or re.match("^[A-Z0-9_]*$", row[2]) is None or re.match("^[A-Z0-9_]*$", row[3]) is None:
               print('{}: {}_{}_{}_{}'.format(line_count,row[0], row[1], row[2], row[3]))
               bad_char_line_count += 1
        line_count += 1
    print('Processed {} lines.'.format(line_count))
    print('Bad char {} lines.'.format(bad_char_line_count))

