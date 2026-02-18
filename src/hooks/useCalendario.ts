import { useState, useEffect, useCallback } from 'react';

export interface EventoCalendarioLocal {
  id: string;
  titulo: string;
  data: string;
  tipo: 'feriado' | 'reuniao' | 'evento' | 'recesso' | 'conselho' | 'formacao' | 'outro';
  descricao?: string;
  cor?: string;
}

const STORAGE_KEY = 'calendario_eventos';

export function useCalendario() {
  const [eventos, setEventos] = useState<EventoCalendarioLocal[]>([]);
  const [carregado, setCarregado] = useState(false);

  // Carregar eventos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEventos(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar eventos do calendário:', e);
      }
    }
    setCarregado(true);
  }, []);

  // Salvar eventos no localStorage
  useEffect(() => {
    if (carregado) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
    }
  }, [eventos, carregado]);

  const adicionarEvento = useCallback((evento: Omit<EventoCalendarioLocal, 'id'>) => {
    const novoEvento: EventoCalendarioLocal = {
      ...evento,
      id: Date.now().toString()
    };
    setEventos(prev => [...prev, novoEvento]);
    return novoEvento;
  }, []);

  const atualizarEvento = useCallback((id: string, dados: Partial<EventoCalendarioLocal>) => {
    setEventos(prev => prev.map(e => e.id === id ? { ...e, ...dados } : e));
  }, []);

  const removerEvento = useCallback((id: string) => {
    setEventos(prev => prev.filter(e => e.id !== id));
  }, []);

  const restaurarEventos = useCallback((novosEventos: EventoCalendarioLocal[]) => {
    setEventos(novosEventos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosEventos));
  }, []);

  return {
    eventos,
    adicionarEvento,
    atualizarEvento,
    removerEvento,
    restaurarEventos
  };
}
