using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PMS.WebAPI.Migrations.ApplicationDb
{
    /// <inheritdoc />
    public partial class loginTablesUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "pms",
                table: "UserLogins",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "pms",
                table: "UserLogins");
        }
    }
}
