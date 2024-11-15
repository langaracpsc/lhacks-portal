"""initial migration

Revision ID: c5755eb30648
Revises: 
Create Date: 2024-07-29 21:17:14.912386

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from typing import Sequence, Union

from alembic import op

import sqlalchemy as sa

from sqlalchemy import column, select, table

import uuid
import time

# revision identifiers, used by Alembic.
revision: str = 'c5755eb30648'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Create meals table
    op.create_table('meals',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(64), nullable=False),
        sa.Column('created_at', sa.Integer(), nullable=False),
        sa.Column('updated_at', sa.Integer(), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('type', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Create meal_tokens table
    op.create_table('meal_tokens',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('user_id', sa.String(36), nullable=False),
        sa.Column('meal_id', sa.String(36), nullable=False),
        sa.Column('used', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('updated_at', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create scans table
    op.create_table('scans',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('email', sa.String(256), nullable=False),
        sa.Column("user_id", sa.String(256), nullable=False),
        sa.Column('createdat', sa.Integer(), nullable=False),
        sa.Column('type', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create users table
    op.create_table('users',
        sa.Column('id', sa.String(65), nullable=False),
        sa.Column('qr_code', sa.String(65), nullable=True),
        sa.Column('email', sa.String(256), nullable=True),
        sa.Column('createdat', sa.Integer(), nullable=True),
        sa.Column('full_name', sa.String(256), nullable=True),
        sa.Column('preferred_name', sa.String(256), nullable=True),
        sa.Column('dietary_restriction', sa.String(256), nullable=True),
        sa.Column('allergies', sa.String(256), nullable=True),
        sa.Column('role', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('qr_code'),
        sa.UniqueConstraint('email')
    )

    # Create applications table
    op.create_table('applications',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('email', sa.String(256), nullable=True),
        sa.Column('createdat', sa.Integer(), nullable=True),
        sa.Column('full_name', sa.String(256), nullable=True),
        sa.Column('preferred_name', sa.String(256), nullable=True),
        sa.Column('dietary_restriction', sa.String(256), nullable=True),
        sa.Column('allergies', sa.String(256), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )

    # Populate meals table
    meals_table = table('meals',
        column('id', sa.String),
        column('name', sa.String),
        column('created_at', sa.Integer),
        column('updated_at', sa.Integer),
        column('active', sa.Boolean),
        column('type', sa.Integer)
    )

    current_time = int(time.time())

    op.bulk_insert(meals_table, [
        {'id': str(uuid.uuid4()), 'name': 'Breakfast', 'created_at': current_time, 'updated_at': current_time, 'active': False, 'type': 0},
        {'id': str(uuid.uuid4()), 'name': 'Lunch', 'created_at': current_time, 'updated_at': current_time, 'active': False, 'type': 1},
        {'id': str(uuid.uuid4()), 'name': 'Dinner', 'created_at': current_time, 'updated_at': current_time, 'active': False, 'type': 2},
        {'id': str(uuid.uuid4()), 'name': 'Snacks', 'created_at': current_time, 'updated_at': current_time, 'active': False, 'type': 3},
        {'id': str(uuid.uuid4()), 'name': 'Breakfast1', 'created_at': current_time, 'updated_at': current_time, 'active': False, 'type': 0},
        {'id': str(uuid.uuid4()), 'name': 'Lunch1', 'created_at': current_time, 'updated_at': current_time, 'active': False, 'type': 1},
        {'id': str(uuid.uuid4()), 'name': 'Dinner1', 'created_at': current_time, 'updated_at': current_time, 'active': False, 'type': 2},
        {'id': str(uuid.uuid4()), 'name': 'Snacks1', 'created_at': current_time, 'updated_at': current_time, 'active': False, 'type': 3},
    ])

def downgrade():
    op.drop_table('applications')
    op.drop_table('users')
    op.drop_table('scans')
    op.drop_table('meal_tokens')
    op.drop_table('meals')