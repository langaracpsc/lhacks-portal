"""empty message

Revision ID: 66aac17d52e1
Revises: c5755eb30648
Create Date: 2024-09-20 00:07:58.146588

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import csv

# revision identifiers, used by Alembic.
revision: str = '66aac17d52e1'
down_revision: Union[str, None] = 'c5755eb30648'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def LoadCSV(path: str):
    return csv.reader(open(path, newline=""), delimiter=" ", quotechar='|')

def upgrade() -> None:
    pass

def downgrade() -> None:
    pass
