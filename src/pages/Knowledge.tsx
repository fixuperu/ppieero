import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { mockKnowledge } from '@/lib/mockData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Pencil, Save, X } from 'lucide-react';
import type { KnowledgeItem } from '@/lib/api';

export default function Knowledge() {
  const [items, setItems] = useState<KnowledgeItem[]>(mockKnowledge);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showNew, setShowNew] = useState(false);

  const startEdit = (item: KnowledgeItem) => {
    setEditingKey(item.key);
    setEditValue(item.value);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const saveEdit = (key: string) => {
    setItems(
      items.map((item) =>
        item.key === key
          ? { ...item, value: editValue, updated_at: new Date().toISOString() }
          : item
      )
    );
    setEditingKey(null);
  };

  const addNew = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setItems([
      ...items,
      { key: newKey.trim(), value: newValue.trim(), updated_at: new Date().toISOString() },
    ]);
    setNewKey('');
    setNewValue('');
    setShowNew(false);
  };

  return (
    <DashboardLayout title="Knowledge Base" subtitle="Base de conocimiento del agente">
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowNew(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Añadir entrada
        </Button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-card-foreground mb-4">Nueva entrada</h3>
          <div className="grid gap-4">
            <Input
              placeholder="Clave (ej: horario, direccion, politica_cancelacion)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Textarea
              placeholder="Valor (el contenido que el agente usará para responder)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNew(false)}>
                Cancelar
              </Button>
              <Button onClick={addNew}>Guardar</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <code className="rounded bg-muted px-2 py-1 text-sm font-mono text-primary">
                  {item.key}
                </code>
                <span className="ml-3 text-xs text-muted-foreground">
                  Actualizado:{' '}
                  {format(new Date(item.updated_at), "dd MMM yyyy 'a las' HH:mm", {
                    locale: es,
                  })}
                </span>
              </div>
              {editingKey !== item.key && (
                <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>

            {editingKey === item.key ? (
              <div className="space-y-3">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={cancelEdit}>
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={() => saveEdit(item.key)}>
                    <Save className="h-4 w-4 mr-1" />
                    Guardar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-card-foreground whitespace-pre-wrap">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
