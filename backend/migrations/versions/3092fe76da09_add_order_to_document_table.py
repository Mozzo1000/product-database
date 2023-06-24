"""Add order to document table

Revision ID: 3092fe76da09
Revises: 758f1c1a0aa8
Create Date: 2023-06-24 16:27:13.805350

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3092fe76da09'
down_revision = '758f1c1a0aa8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('document', schema=None) as batch_op:
        batch_op.add_column(sa.Column('order', sa.Integer(), server_default='1', nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('document', schema=None) as batch_op:
        batch_op.drop_column('order')

    # ### end Alembic commands ###
