import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddBolimNameMutation,
  useBolimNameQuery,
  useEditBolimNameMutation,
} from "@/services/api";
import {
  IconIndentIncrease,
  IconEdit,
  IconCheck,
  IconPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export function CreatedBolumNAme() {
  const { data = [], refetch } = useBolimNameQuery();

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [open, setOpen] = useState(false);

  const [editBolimName, { isLoading: editLoading }] =
    useEditBolimNameMutation();
  const [addBolimName, { isLoading: addLoading }] = useAddBolimNameMutation();

  // API → local state
  useEffect(() => {
    setItems(
      data.map((item) => ({
        ...item,
        isEditing: false,
      })),
    );
  }, [data]);

  // 🔄 Input change handler
  const handleChange = (id, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, nomi: value } : item)),
    );
  };

  // ✅ UPDATE
  const handleUpdate = async (item) => {
    try {
      await editBolimName({
        id: item.id,
        body: {
          nomi: item.nomi,
        },
      }).unwrap();

      setItems((prev) =>
        prev.map((el) =>
          el.id === item.id ? { ...el, isEditing: false } : el,
        ),
      );

      refetch();
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  // ➕ CREATE
  const handleCreate = async () => {
    try {
      await addBolimName({
        body: {
          nomi: newItem,
        },
      }).unwrap();

      setNewItem("");
      refetch();
    } catch (err) {
      console.error("CREATE ERROR:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Bo‘limlar haqida
          <IconIndentIncrease size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bo‘limlar</DialogTitle>
          <DialogDescription>
            Mavjud bo‘limlarni tahrirlash yoki yangi bo‘lim qo‘shish
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Label>Bo‘lim nomlari</Label>

          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                value={item.nomi}
                disabled={!item.isEditing}
                onChange={(e) => handleChange(item.id, e.target.value)}
              />

              {!item.isEditing ? (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setItems((prev) =>
                      prev.map((el) =>
                        el.id === item.id ? { ...el, isEditing: true } : el,
                      ),
                    )
                  }
                >
                  <IconEdit size={18} />
                </Button>
              ) : (
                <Button
                  size="icon"
                  disabled={editLoading}
                  onClick={() => handleUpdate(item)}
                >
                  <IconCheck size={18} />
                </Button>
              )}
            </div>
          ))}

          {/* ➕ YANGI BO‘LIM */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Input
              placeholder="Yangi bo‘lim nomi..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />

            <Button
              size="icon"
              disabled={!newItem || addLoading}
              onClick={handleCreate}
            >
              <IconPlus size={18} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
