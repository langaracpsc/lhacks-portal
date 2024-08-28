# LHacks Portal Flask Backend

## Setup

### Create and activate a virtual environment

#### On Unix-based systems (Linux/macOS):
```
python3 -m venv .venv
source .venv/bin/activate
```

#### On Windows:
```
python -m venv .venv
.venv\Scripts\activate
```

### Install the required packages

#### On Unix-based systems (Linux/macOS):
```
pip3 install -r requirements.txt
```

#### On Windows:
```
pip install -r requirements.txt
```

### Set the environment variables in the `.env` file

Create a `.env` file in the root directory of the project and add the following variables:

```
AUTH0_CLIENT_ID=<YOUR_AUTH0_CLIENT_ID>
AUTH0_CLIENT_SECRET=<YOUR_AUTH0_CLIENT_SECRET>
AUTH0_DOMAIN=<YOUR_AUTH0_DOMAIN>
AUTH0_API_IDENTIFIER=127.0.0.1:5001
APP_SECRET_KEY=<YOUR_APP_SECRET_KEY>
CONNECTION_STRING=postgresql://<USERNAME>:<PASSWORD>@<HOST>:5432/<DATABASE>
PORT=5001
CLIENT_URL=<YOUR_FRONTEND_URL>
POSTGRES_PASSWORD=<YOUR_POSTGRES_PASSWORD>
```

Replace the placeholders with your actual values. Make sure to keep this file secure and never commit it to version control.

### Configure and apply database migrations with Alembic

The Alembic folder and migrations already exist in the project. You need to configure and apply the migrations:

1. Create an `alembic.ini` file in the root directory of the project with the following content:

```ini
# A generic, single database configuration.
[alembic]
# path to migration scripts
script_location = alembic

# template used to generate migration file names; The default value is %%(rev)s_%%(slug)s
# Uncomment the line below if you want the files to be prepended with date and time
# file_template = %%(year)d_%%(month).2d_%%(day).2d_%%(hour).2d%%(minute).2d-%%(rev)s_%%(slug)s

# sys.path path, will be prepended to sys.path if present.
# defaults to the current working directory.
prepend_sys_path = .

# timezone to use when rendering the date within the migration file
# as well as the filename.
# If specified, requires the python>=3.9 or backports.zoneinfo library.
# Any required deps can installed by adding `alembic[tz]` to the pip requirements
# timezone =

# max length of characters to apply to the "slug" field
# truncate_slug_length = 40

# set to 'true' to run the environment during
# the 'revision' command, regardless of autogenerate
# revision_environment = false

# set to 'true' to allow .pyc and .pyo files without
# a source .py file to be detected as revisions in the
# versions/ directory
# sourceless = false

# version location specification; This defaults
# to alembic/versions.  When using multiple version
# directories, initial revisions must be specified with --version-path.
# The path separator used here should be the separator specified by "version_path_separator" below.
# version_locations = %(here)s/bar:%(here)s/bat:alembic/versions

# version path separator; As mentioned above, this is the character used to split
# version_locations. The default within new alembic.ini files is "os", which uses os.pathsep.
# If this key is omitted entirely, it falls back to the legacy behavior of splitting on spaces and/or commas.
# Valid values for version_path_separator are:
#
# version_path_separator = :
# version_path_separator = ;
# version_path_separator = space
version_path_separator = os  # Use os.pathsep. Default configuration used for new projects.

# set to 'true' to search source files recursively
# in each "version_locations" directory
# new in Alembic version 1.10
# recursive_version_locations = false

# the output encoding used when revision files
# are written from script.py.mako
# output_encoding = utf-8

sqlalchemy.url = %(DB_CONNECTION_STRING)s

[post_write_hooks]
# post_write_hooks defines scripts or Python functions that are run
# on newly generated revision scripts.  See the documentation for further
# detail and examples

# format using "black" - use the console_scripts runner, against the "black" entrypoint
# hooks = black
# black.type = console_scripts
# black.entrypoint = black
# black.options = -l 79 REVISION_SCRIPT_FILENAME

# Logging configuration
[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

2. Make sure to set the `sqlalchemy.url` in the `alembic.ini` file to use the `DB_CONNECTION_STRING` environment variable:

```ini
sqlalchemy.url = %(DB_CONNECTION_STRING)s
```

3. Apply the existing migrations to your database:
```
alembic upgrade head
```

This will update your database schema to the latest version.

### Run the API

Before running the API, make sure you've applied all database migrations as described in the previous step.

Then start the Flask application:

```
flask --app api run --host 0.0.0.0 --port 5001
```

This command will start the Flask application, making it accessible on all network interfaces on port 5001.