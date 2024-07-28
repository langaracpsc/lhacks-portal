"""empty message

Revision ID: 2ae1c1fd0fed
Revises: 967342f79abd
Create Date: 2024-07-27 02:00:53.314907

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '2ae1c1fd0fed'
down_revision: Union[str, None] = '967342f79abd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    pass

def downgrade() -> None:
    pass
