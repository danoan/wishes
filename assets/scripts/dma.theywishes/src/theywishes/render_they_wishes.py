#!/usr/bin/env python3

from jinja2 import Template
import json
import sys
import argparse

def render(json_data,template_folder='.'):
  html_page = f"{template_folder}/{json_data['Template']}/they-wishes.html"

  with open(html_page,'r') as f:
    t = Template(f.read())
    sys.stdout.write(t.render(data=json_data))

def main():
  parser = argparse.ArgumentParser(description="Render They wishes page")
  parser.add_argument('config_file_path',type=str, help="Configuration file path for the template to be rendered")
  parser.add_argument('--from-user-name', type=str, help="Render the default template with a given user name")
  parser.add_argument('--template-folder', type=str, help="Location folder of templates")

  args = parser.parse_args()
  with open(args.config_file_path) as f:
    json_data = json.load(f)
    if args.from_user_name is not None:
        json_data['Name'] = args.from_user_name.capitalize()
    render(json_data,args.template_folder)

if __name__=='__main__':
  main()
