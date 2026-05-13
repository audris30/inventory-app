using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryAPI.Data;
using InventoryAPI.Models;

using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace InventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InventoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET all
       [HttpGet]
public async Task<IActionResult> Get(
    string? type,
    string? comment,
    string? user)
{
    var query = _context.InventoryItems
        .Where(x => x.Active == true)
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(type))
    {
        query = query.Where(x => x.Type.Contains(type));
    }

    if (!string.IsNullOrWhiteSpace(comment))
    {
        query = query.Where(x => x.Comment.Contains(comment));
    }

    if (!string.IsNullOrWhiteSpace(user))
    {
        query = query.Where(x => x.UserId.ToString().Contains(user));
    }

    var items = await query.ToListAsync();

    return Ok(items);
}

        // POST
        [HttpPost]
public async Task<IActionResult> Add([FromBody] InventoryItem item)
{
    if (item == null)
        return BadRequest();

    item.Active = true;

    _context.InventoryItems.Add(item);

    await _context.SaveChangesAsync();

    return Ok(item);
}

        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] InventoryItem updated)
        {
            var item = await _context.InventoryItems.FindAsync(id);

            if (item == null)
                return NotFound();

            item.Type = updated.Type;
            item.Comment = updated.Comment;
            item.UserId = updated.UserId;
            item.Active = updated.Active;
            item.Date = updated.Date;

            await _context.SaveChangesAsync();

            return Ok(item);
        }

        [HttpGet("export")]
public async Task<IActionResult> ExportPdf(
    string? type,
    string? comment,
    string? user,
    string template = "simple")
{
    var query = _context.InventoryItems
        .Where(x => x.Active == true)
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(type))
    {
        query = query.Where(x => x.Type.Contains(type));
    }

    if (!string.IsNullOrWhiteSpace(comment))
    {
        query = query.Where(x => x.Comment.Contains(comment));
    }

    if (!string.IsNullOrWhiteSpace(user))
    {
        query = query.Where(x => x.UserId.ToString().Contains(user));
    }

    var items = await query.ToListAsync();

    var pdf = Document.Create(container =>
    {
        container.Page(page =>
        {
            page.Margin(30);

            page.Header()
                .Text("Inventory Export")
                .FontSize(20)
                .Bold();

            page.Content().Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                });

                // TEMPLATE 1
                if (template == "modern")
                {
                    table.Header(header =>
                    {
                        header.Cell().Background(Colors.Blue.Lighten2).Padding(5).Text("Type");
                        header.Cell().Background(Colors.Blue.Lighten2).Padding(5).Text("Comment");
                        header.Cell().Background(Colors.Blue.Lighten2).Padding(5).Text("User");
                    });
                }
                else
                {
                    table.Header(header =>
                    {
                        header.Cell().Text("Type");
                        header.Cell().Text("Comment");
                        header.Cell().Text("User");
                    });
                }

                foreach (var item in items)
                {
                    table.Cell().Padding(5).Text(item.Type ?? "");
                    table.Cell().Padding(5).Text(item.Comment ?? "");
                    table.Cell().Padding(5).Text(item.UserId.ToString());
                }
            });
        });
    }).GeneratePdf();

    return File(pdf, "application/pdf", "inventory.pdf");
}

      // DELETE (SOFT DELETE)
[HttpDelete("{id}")]
public async Task<IActionResult> Delete(long id)
{
    var item = await _context.InventoryItems.FindAsync(id);

    if (item == null)
        return NotFound();

    item.Active = false;

    await _context.SaveChangesAsync();

    return Ok();
}
    }
}