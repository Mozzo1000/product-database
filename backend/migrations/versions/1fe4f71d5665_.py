"""empty message

Revision ID: 1fe4f71d5665
Revises: 103baff07c73
Create Date: 2022-05-26 13:03:09.213048

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1fe4f71d5665'
down_revision = '103baff07c73'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('brand', sa.Column('url', sa.String(), nullable=True))
    op.add_column('users', sa.Column('status', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'status')
    op.drop_column('brand', 'url')
    # ### end Alembic commands ###
