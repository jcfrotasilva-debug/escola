import { useState, useEffect } from 'react';

interface Evento {
  id: string;
  titulo: string;
  data: string;
  tipo: 'feriado' | 'reuniao' | 'evento' | 'recesso' | 'conselho' | 'formacao' | 'outro';
  descricao?: string;
  cor?: string;
}

const CORES_TIPO: Record<string, { bg: string; text: string; label: string }> = {
  feriado: { bg: 'bg-red-100', text: 'text-red-800', label: '🔴 Feriado' },
  reuniao: { bg: 'bg-blue-100', text: 'text-blue-800', label: '🔵 Reunião' },
  evento: { bg: 'bg-green-100', text: 'text-green-800', label: '🟢 Evento' },
  recesso: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🟡 Recesso' },
  conselho: { bg: 'bg-purple-100', text: 'text-purple-800', label: '🟣 Conselho' },
  formacao: { bg: 'bg-orange-100', text: 'text-orange-800', label: '🟠 Formação' },
  outro: { bg: 'bg-gray-100', text: 'text-gray-800', label: '⚪ Outro' },
};

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function CalendarioEscolar() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  
  // Form
  const [formTitulo, setFormTitulo] = useState('');
  const [formData, setFormData] = useState('');
  const [formTipo, setFormTipo] = useState<Evento['tipo']>('evento');
  const [formDescricao, setFormDescricao] = useState('');

  // Carregar eventos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('calendario_eventos');
    if (saved) {
      setEventos(JSON.parse(saved));
    }
  }, []);

  // Salvar eventos no localStorage
  useEffect(() => {
    localStorage.setItem('calendario_eventos', JSON.stringify(eventos));
  }, [eventos]);

  // Gerar dias do mês
  const gerarDiasDoMes = () => {
    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaSemanaInicio = primeiroDia.getDay();
    
    const dias: Array<{ dia: number; data: string } | null> = [];
    
    // Dias vazios no início
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }
    
    // Dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      dias.push({ dia, data });
    }
    
    return dias;
  };

  // Eventos de uma data
  const eventosNaData = (data: string) => {
    return eventos.filter(e => e.data === data);
  };

  // Abrir modal para novo evento
  const abrirModalNovo = (data?: string) => {
    setEventoEditando(null);
    setFormTitulo('');
    setFormData(data || '');
    setFormTipo('evento');
    setFormDescricao('');
    setModalAberto(true);
  };

  // Abrir modal para editar evento
  const abrirModalEditar = (evento: Evento) => {
    setEventoEditando(evento);
    setFormTitulo(evento.titulo);
    setFormData(evento.data);
    setFormTipo(evento.tipo);
    setFormDescricao(evento.descricao || '');
    setModalAberto(true);
  };

  // Salvar evento
  const salvarEvento = () => {
    if (!formTitulo.trim() || !formData) {
      alert('Preencha o título e a data!');
      return;
    }

    if (eventoEditando) {
      setEventos(eventos.map(e => 
        e.id === eventoEditando.id 
          ? { ...e, titulo: formTitulo, data: formData, tipo: formTipo, descricao: formDescricao }
          : e
      ));
    } else {
      const novoEvento: Evento = {
        id: Date.now().toString(),
        titulo: formTitulo,
        data: formData,
        tipo: formTipo,
        descricao: formDescricao
      };
      setEventos([...eventos, novoEvento]);
    }
    
    setModalAberto(false);
  };

  // Remover evento
  const removerEvento = (id: string) => {
    if (confirm('Deseja remover este evento?')) {
      setEventos(eventos.filter(e => e.id !== id));
    }
  };

  // Navegação
  const mesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
  };

  const mesSeguinte = () => {
    if (mesAtual === 11) {
      setMesAtual(0);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
  };

  const dias = gerarDiasDoMes();
  const hoje = new Date().toISOString().split('T')[0];

  // Próximos eventos
  const proximosEventos = eventos
    .filter(e => e.data >= hoje)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">📅 Calendário Escolar</h1>
        <p className="text-indigo-100 mt-1">Gerencie eventos, feriados e reuniões</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          {/* Navegação do mês */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={mesAnterior}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ◀️
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {MESES[mesAtual]} {anoAtual}
            </h2>
            <button
              onClick={mesSeguinte}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ▶️
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DIAS_SEMANA.map(dia => (
              <div key={dia} className="text-center text-sm font-semibold text-gray-600 py-2">
                {dia}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1">
            {dias.map((diaObj, idx) => {
              if (!diaObj) {
                return <div key={`empty-${idx}`} className="h-24 bg-gray-50 rounded-lg" />;
              }

              const eventosHoje = eventosNaData(diaObj.data);
              const isHoje = diaObj.data === hoje;

              return (
                <div
                  key={diaObj.data}
                  onClick={() => abrirModalNovo(diaObj.data)}
                  className={`h-24 p-1 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    isHoje ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`text-sm font-semibold ${isHoje ? 'text-blue-600' : 'text-gray-700'}`}>
                    {diaObj.dia}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    {eventosHoje.slice(0, 2).map(evento => (
                      <div
                        key={evento.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirModalEditar(evento);
                        }}
                        className={`text-xs px-1 py-0.5 rounded truncate ${CORES_TIPO[evento.tipo].bg} ${CORES_TIPO[evento.tipo].text}`}
                      >
                        {evento.titulo}
                      </div>
                    ))}
                    {eventosHoje.length > 2 && (
                      <div className="text-xs text-gray-500">+{eventosHoje.length - 2} mais</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.entries(CORES_TIPO).map(([tipo, config]) => (
              <div key={tipo} className={`px-2 py-1 rounded-full text-xs ${config.bg} ${config.text}`}>
                {config.label}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Botão adicionar */}
          <button
            onClick={() => abrirModalNovo()}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            ➕ Novo Evento
          </button>

          {/* Próximos eventos */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-4">📌 Próximos Eventos</h3>
            {proximosEventos.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum evento programado</p>
            ) : (
              <div className="space-y-3">
                {proximosEventos.map(evento => (
                  <div
                    key={evento.id}
                    className={`p-3 rounded-lg ${CORES_TIPO[evento.tipo].bg} cursor-pointer hover:opacity-80`}
                    onClick={() => abrirModalEditar(evento)}
                  >
                    <div className={`font-semibold text-sm ${CORES_TIPO[evento.tipo].text}`}>
                      {evento.titulo}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      📅 {new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estatísticas */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold text-gray-800 mb-4">📊 Estatísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de eventos:</span>
                <span className="font-semibold">{eventos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Feriados:</span>
                <span className="font-semibold">{eventos.filter(e => e.tipo === 'feriado').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reuniões:</span>
                <span className="font-semibold">{eventos.filter(e => e.tipo === 'reuniao').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Eventos:</span>
                <span className="font-semibold">{eventos.filter(e => e.tipo === 'evento').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {eventoEditando ? '✏️ Editar Evento' : '➕ Novo Evento'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formTitulo}
                    onChange={(e) => setFormTitulo(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ex: Reunião de Pais"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formData}
                    onChange={(e) => setFormData(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value as Evento['tipo'])}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Object.entries(CORES_TIPO).map(([tipo, config]) => (
                      <option key={tipo} value={tipo}>{config.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="Detalhes do evento..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={salvarEvento}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  💾 Salvar
                </button>
                {eventoEditando && (
                  <button
                    onClick={() => {
                      removerEvento(eventoEditando.id);
                      setModalAberto(false);
                    }}
                    className="bg-red-100 text-red-600 py-2 px-4 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                  >
                    🗑️
                  </button>
                )}
                <button
                  onClick={() => setModalAberto(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
