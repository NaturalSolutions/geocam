"""update_files_table

Revision ID: 7f9fbde02f83
Revises: 999aa6bb1fc9
Create Date: 2024-12-13 15:54:00.056366

"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "7f9fbde02f83"
down_revision = "999aa6bb1fc9"
branch_labels = None
depends_on = None


def upgrade():
    op.execute(
        """
            ALTER TABLE files 
            RENAME COLUMN date TO import_date
         """
    )

    op.execute(
        """
            ALTER TABLE files
            ADD COLUMN date TIMESTAMP
        """
    )


def downgrade():
    op.execute(
        """
            ALTER TABLE files
            DROP COLUMN date TIMESTAMP
    
         """
    )

    op.execute(
        """
            ALTER TABLE files 
            RENAME COLUMN import_date TO date;      
         """
    )
