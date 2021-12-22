"""Change product table name

Revision ID: 35ce34d4e586
Revises: b8824e08d502
Create Date: 2021-12-22 09:27:33.697689

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '35ce34d4e586'
down_revision = 'b8824e08d502'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('product',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('brand_id', sa.Integer(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.Column('attribute_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['attribute_id'], ['attribute.id'], ),
    sa.ForeignKeyConstraint(['brand_id'], ['brand.id'], ),
    sa.ForeignKeyConstraint(['category_id'], ['category.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('type_screen')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('type_screen',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('brand_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('category_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('attribute_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_at', postgresql.TIMESTAMP(), server_default=sa.text('now()'), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['attribute_id'], ['attribute.id'], name='type_screen_attribute_id_fkey'),
    sa.ForeignKeyConstraint(['brand_id'], ['brand.id'], name='type_screen_brand_id_fkey'),
    sa.ForeignKeyConstraint(['category_id'], ['category.id'], name='type_screen_category_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='type_screen_pkey')
    )
    op.drop_table('product')
    # ### end Alembic commands ###
