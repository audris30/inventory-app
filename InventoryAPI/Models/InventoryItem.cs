namespace InventoryAPI.Models
{
    public class InventoryItem
    {
        public long Id { get; set; }
        public string Type { get; set; } = "";
        public string Comment { get; set; } = "";
        public int UserId { get; set; }
        public bool Active { get; set; } = true;
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}