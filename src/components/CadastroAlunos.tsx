import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useAlunos } from '../hooks/useAlunos';
import { Aluno, SituacaoAluno, Responsavel, Ocorrencia, FichaSaude } from '../types';

// Componente Modal para Responsável
function ModalResponsavel({ 
  responsavel, 
  onSalvar, 
  onCancelar 
}: { 
  responsavel: Responsavel | null; 
  onSalvar: (r: Responsavel) => void; 
  onCancelar: () => void;
}) {
  const [form, setForm] = useState<Partial<Responsavel>>(responsavel || {
    nome: '',
    parentesco: 'Mãe' as const,
    cpf: '',
    rg: '',
    telefoneCelular: '',
    telefoneResidencial: '',
    email: '',
    profissao: '',
    localTrabalho: '',
    endereco: '',
    responsavelFinanceiro: false,
    responsavelPedagogico: false,
    autorizadoBuscar: true,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold">
            {responsavel ? '✏️ Editar Responsável' : '➕ Novo Responsável'}
          </h2>
          <button onClick={onCancelar} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Nome Completo *</label>
              <input
                type="text"
                value={form.nome || ''}
                onChange={(e) => setForm({...form, nome: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Parentesco *</label>
              <select
                value={form.parentesco || 'Mãe'}
                onChange={(e) => setForm({...form, parentesco: e.target.value as Responsavel['parentesco']})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Mãe">Mãe</option>
                <option value="Pai">Pai</option>
                <option value="Avó">Avó</option>
                <option value="Avô">Avô</option>
                <option value="Tia">Tia</option>
                <option value="Tio">Tio</option>
                <option value="Irmã">Irmã</option>
                <option value="Irmão">Irmão</option>
                <option value="Padrasto">Padrasto</option>
                <option value="Madrasta">Madrasta</option>
                <option value="Responsável Legal">Responsável Legal</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPF</label>
              <input
                type="text"
                value={form.cpf || ''}
                onChange={(e) => setForm({...form, cpf: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Celular *</label>
              <input
                type="text"
                value={form.telefoneCelular || ''}
                onChange={(e) => setForm({...form, telefoneCelular: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone Residencial</label>
              <input
                type="text"
                value={form.telefoneResidencial || ''}
                onChange={(e) => setForm({...form, telefoneResidencial: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Profissão</label>
              <input
                type="text"
                value={form.profissao || ''}
                onChange={(e) => setForm({...form, profissao: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Local de Trabalho</label>
              <input
                type="text"
                value={form.localTrabalho || ''}
                onChange={(e) => setForm({...form, localTrabalho: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Endereço</label>
              <input
                type="text"
                value={form.endereco || ''}
                onChange={(e) => setForm({...form, endereco: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Autorizações e Responsabilidades</h4>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.responsavelFinanceiro || false}
                  onChange={(e) => setForm({...form, responsavelFinanceiro: e.target.checked})}
                  className="w-4 h-4"
                />
                <span>💰 Responsável Financeiro</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.responsavelPedagogico || false}
                  onChange={(e) => setForm({...form, responsavelPedagogico: e.target.checked})}
                  className="w-4 h-4"
                />
                <span>📚 Responsável Pedagógico</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autorizadoBuscar || false}
                  onChange={(e) => setForm({...form, autorizadoBuscar: e.target.checked})}
                  className="w-4 h-4"
                />
                <span>🚗 Autorizado a Buscar</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
          <button onClick={onCancelar} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!form.nome) {
                alert('Nome é obrigatório!');
                return;
              }
              onSalvar(form as Responsavel);
            }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            💾 Salvar Responsável
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente Modal para Ocorrência
function ModalOcorrencia({ 
  ocorrencia, 
  onSalvar, 
  onCancelar 
}: { 
  ocorrencia: Ocorrencia | null; 
  onSalvar: (o: Ocorrencia) => void; 
  onCancelar: () => void;
}) {
  const hoje = new Date().toISOString().split('T')[0];
  const horaAtual = new Date().toTimeString().slice(0, 5);

  const [form, setForm] = useState<Partial<Ocorrencia>>(ocorrencia || {
    titulo: '',
    tipo: 'Pedagógico',
    data: hoje,
    hora: horaAtual,
    descricao: '',
    providencias: '',
    responsavelRegistro: '',
    cargoResponsavel: '',
    status: 'Aberto',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold">
            {ocorrencia ? '✏️ Editar Ocorrência' : '➕ Nova Ocorrência'}
          </h2>
          <button onClick={onCancelar} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <input
              type="text"
              value={form.titulo || ''}
              onChange={(e) => setForm({...form, titulo: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Resumo da ocorrência"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo *</label>
              <select
                value={form.tipo || 'Pedagógico'}
                onChange={(e) => setForm({...form, tipo: e.target.value as Ocorrencia['tipo']})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Disciplinar">🚨 Disciplinar</option>
                <option value="Pedagógico">📚 Pedagógico</option>
                <option value="Saúde">🏥 Saúde</option>
                <option value="Família">👨‍👩‍👦 Família</option>
                <option value="Bullying">⚠️ Bullying</option>
                <option value="Elogio">🌟 Elogio</option>
                <option value="Outro">📝 Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status || 'Aberto'}
                onChange={(e) => setForm({...form, status: e.target.value as Ocorrencia['status']})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="Aberto">🟡 Aberto</option>
                <option value="Em andamento">🔵 Em andamento</option>
                <option value="Concluído">🟢 Concluído</option>
                <option value="Arquivado">⚫ Arquivado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <input
                type="date"
                value={form.data || hoje}
                onChange={(e) => setForm({...form, data: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hora</label>
              <input
                type="time"
                value={form.hora || horaAtual}
                onChange={(e) => setForm({...form, hora: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição Detalhada *</label>
            <textarea
              value={form.descricao || ''}
              onChange={(e) => setForm({...form, descricao: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
              placeholder="Descreva o que aconteceu..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Providências Tomadas</label>
            <textarea
              value={form.providencias || ''}
              onChange={(e) => setForm({...form, providencias: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="Quais medidas foram tomadas..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Responsável pelo Registro *</label>
              <input
                type="text"
                value={form.responsavelRegistro || ''}
                onChange={(e) => setForm({...form, responsavelRegistro: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Nome de quem está registrando"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cargo</label>
              <input
                type="text"
                value={form.cargoResponsavel || ''}
                onChange={(e) => setForm({...form, cargoResponsavel: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Professor, Coordenador, etc."
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
          <button onClick={onCancelar} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!form.titulo || !form.descricao || !form.responsavelRegistro) {
                alert('Preencha os campos obrigatórios: Título, Descrição e Responsável');
                return;
              }
              onSalvar(form as Ocorrencia);
            }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            💾 Salvar Ocorrência
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente Modal para Ficha de Saúde
function ModalFichaSaude({ 
  fichaSaude, 
  onSalvar, 
  onCancelar 
}: { 
  fichaSaude: FichaSaude | null; 
  onSalvar: (f: FichaSaude) => void; 
  onCancelar: () => void;
}) {
  const [form, setForm] = useState<Partial<FichaSaude>>(fichaSaude || {
    tipoSanguineo: 'Não informado',
    alergias: [],
    medicamentosUso: [],
    restricoesAlimentares: [],
    doencasCronicas: [],
    deficiencias: [],
    planoSaude: '',
    numeroCartaoSus: '',
    contatoEmergencia: '',
    telefoneEmergencia: '',
    medicoResponsavel: '',
    telefoneMedico: '',
    autorizaAtendimentoEmergencia: true,
    autorizaMedicacao: false,
    vacinasEmDia: true,
  });

  const [novaAlergia, setNovaAlergia] = useState('');
  const [novoMedicamento, setNovoMedicamento] = useState('');
  const [novaRestricao, setNovaRestricao] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-bold">🏥 Ficha de Saúde</h2>
          <button onClick={onCancelar} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Emergência */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-bold text-red-700 mb-4">🚨 Informações de Emergência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contato de Emergência *</label>
                <input
                  type="text"
                  value={form.contatoEmergencia || ''}
                  onChange={(e) => setForm({...form, contatoEmergencia: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Nome do contato"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone de Emergência *</label>
                <input
                  type="text"
                  value={form.telefoneEmergencia || ''}
                  onChange={(e) => setForm({...form, telefoneEmergencia: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo Sanguíneo</label>
                <select
                  value={form.tipoSanguineo || 'Não informado'}
                onChange={(e) => setForm({...form, tipoSanguineo: e.target.value as FichaSaude['tipoSanguineo']})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Selecione...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dados de Saúde */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-700 mb-4">📋 Dados de Saúde</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plano de Saúde</label>
                <input
                  type="text"
                  value={form.planoSaude || ''}
                  onChange={(e) => setForm({...form, planoSaude: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cartão SUS</label>
                <input
                  type="text"
                  value={form.numeroCartaoSus || ''}
                  onChange={(e) => setForm({...form, numeroCartaoSus: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Médico Responsável</label>
                <input
                  type="text"
                  value={form.medicoResponsavel || ''}
                  onChange={(e) => setForm({...form, medicoResponsavel: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone do Médico</label>
                <input
                  type="text"
                  value={form.telefoneMedico || ''}
                  onChange={(e) => setForm({...form, telefoneMedico: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Alergias */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-bold text-yellow-700 mb-4">⚠️ Alergias</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={novaAlergia}
                onChange={(e) => setNovaAlergia(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Digite uma alergia e clique em adicionar"
              />
              <button
                onClick={() => {
                  if (novaAlergia.trim()) {
                    setForm({...form, alergias: [...(form.alergias || []), novaAlergia.trim()]});
                    setNovaAlergia('');
                  }
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                ➕
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.alergias?.map((a, i) => (
                <span key={i} className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full flex items-center gap-2">
                  {a}
                  <button
                    onClick={() => setForm({...form, alergias: form.alergias?.filter((_, idx) => idx !== i)})}
                    className="text-yellow-600 hover:text-yellow-800"
                  >×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Medicamentos */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-bold text-purple-700 mb-4">💊 Medicamentos em Uso Contínuo</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={novoMedicamento}
                onChange={(e) => setNovoMedicamento(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Nome do medicamento"
              />
              <button
                onClick={() => {
                  if (novoMedicamento.trim()) {
                    setForm({...form, medicamentosUso: [...(form.medicamentosUso || []), novoMedicamento.trim()]});
                    setNovoMedicamento('');
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                ➕
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.medicamentosUso?.map((m, i) => (
                <span key={i} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full flex items-center gap-2">
                  {m}
                  <button
                    onClick={() => setForm({...form, medicamentosUso: form.medicamentosUso?.filter((_, idx) => idx !== i)})}
                    className="text-purple-600 hover:text-purple-800"
                  >×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Restrições Alimentares */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-bold text-orange-700 mb-4">🍽️ Restrições Alimentares</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={novaRestricao}
                onChange={(e) => setNovaRestricao(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Ex: Intolerância à lactose"
              />
              <button
                onClick={() => {
                  if (novaRestricao.trim()) {
                    setForm({...form, restricoesAlimentares: [...(form.restricoesAlimentares || []), novaRestricao.trim()]});
                    setNovaRestricao('');
                  }
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                ➕
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.restricoesAlimentares?.map((r, i) => (
                <span key={i} className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full flex items-center gap-2">
                  {r}
                  <button
                    onClick={() => setForm({...form, restricoesAlimentares: form.restricoesAlimentares?.filter((_, idx) => idx !== i)})}
                    className="text-orange-600 hover:text-orange-800"
                  >×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Autorizações */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-green-700 mb-4">✅ Autorizações</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autorizaAtendimentoEmergencia || false}
                  onChange={(e) => setForm({...form, autorizaAtendimentoEmergencia: e.target.checked})}
                  className="w-5 h-5"
                />
                <span>Autorizo atendimento médico de emergência</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.autorizaMedicacao || false}
                  onChange={(e) => setForm({...form, autorizaMedicacao: e.target.checked})}
                  className="w-5 h-5"
                />
                <span>Autorizo administração de medicação pela escola</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.vacinasEmDia || false}
                  onChange={(e) => setForm({...form, vacinasEmDia: e.target.checked})}
                  className="w-5 h-5"
                />
                <span>Vacinas em dia</span>
              </label>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium mb-1">Observações Adicionais</label>
            <textarea
              value={form.observacoesMedicas || ''}
              onChange={(e) => setForm({...form, observacoesMedicas: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              placeholder="Outras informações importantes sobre a saúde do aluno..."
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
          <button onClick={onCancelar} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!form.contatoEmergencia || !form.telefoneEmergencia) {
                alert('Preencha o contato e telefone de emergência!');
                return;
              }
              onSalvar(form as FichaSaude);
            }}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            💾 Salvar Ficha de Saúde
          </button>
        </div>
      </div>
    </div>
  );
}

type TabAlunos = 'lista' | 'upload' | 'turmas' | 'aee' | 'ficha';
type TabFicha = 'dados' | 'responsaveis' | 'saude' | 'ocorrencias';

export default function CadastroAlunos() {
  const {
    alunos,
    turmas,
    turmasResumo,
    estatisticas,
    alunosAEE,
    loading,
    importarPlanilha,
    adicionarAluno,
    atualizarAluno,
    removerAluno,
    limparAlunos,
    buscarAlunos,
  } = useAlunos();

  const [activeTab, setActiveTab] = useState<TabAlunos>('lista');
  const [busca, setBusca] = useState('');
  const [filtroTurma, setFiltroTurma] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState<SituacaoAluno | ''>('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [tabFicha, setTabFicha] = useState<TabFicha>('dados');
  const [showFormResponsavel, setShowFormResponsavel] = useState(false);
  const [showFormOcorrencia, setShowFormOcorrencia] = useState(false);
  const [showFormSaude, setShowFormSaude] = useState(false);
  const [responsavelEditando, setResponsavelEditando] = useState<Responsavel | null>(null);
  const [ocorrenciaEditando, setOcorrenciaEditando] = useState<Ocorrencia | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  // Form do aluno
  const [formAluno, setFormAluno] = useState<Partial<Aluno>>({
    ano: '',
    turma: '',
    rm: '',
    numeroChamada: 1,
    nome: '',
    ra: '',
    dvRa: '',
    ufRa: 'SP',
    dataNascimento: '',
    situacao: 'Ativo',
    deficiencia: '',
    endereco: '',
    nomeMae: '',
    nomePai: '',
    telefone: '',
    email: '',
    observacoes: '',
  });

  // Alunos filtrados
  const alunosFiltrados = buscarAlunos(busca, filtroTurma || undefined, filtroSituacao as SituacaoAluno || undefined);

  // Handler para upload de arquivo
  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const quantidade = importarPlanilha(jsonData as Record<string, unknown>[]);
        setMensagem({ tipo: 'sucesso', texto: `${quantidade} alunos importados com sucesso!` });
        setActiveTab('lista');
      } catch {
        setMensagem({ tipo: 'erro', texto: 'Erro ao ler o arquivo. Verifique se é um arquivo Excel válido.' });
      }
    };
    reader.readAsBinaryString(file);
  }, [importarPlanilha]);

  // Handlers de drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Handlers do formulário
  const handleSalvarAluno = () => {
    if (!formAluno.nome) {
      setMensagem({ tipo: 'erro', texto: 'Nome do aluno é obrigatório!' });
      return;
    }

    if (modoEdicao && alunoSelecionado) {
      atualizarAluno(alunoSelecionado.id, formAluno);
      setMensagem({ tipo: 'sucesso', texto: 'Aluno atualizado com sucesso!' });
    } else {
      adicionarAluno(formAluno as Omit<Aluno, 'id' | 'createdAt' | 'updatedAt' | 'idade'>);
      setMensagem({ tipo: 'sucesso', texto: 'Aluno cadastrado com sucesso!' });
    }

    setShowForm(false);
    setModoEdicao(false);
    setAlunoSelecionado(null);
    resetForm();
  };

  const resetForm = () => {
    setFormAluno({
      ano: '',
      turma: '',
      rm: '',
      numeroChamada: 1,
      nome: '',
      ra: '',
      dvRa: '',
      ufRa: 'SP',
      dataNascimento: '',
      situacao: 'Ativo',
      deficiencia: '',
      endereco: '',
      nomeMae: '',
      nomePai: '',
      telefone: '',
      email: '',
      observacoes: '',
    });
  };

  const handleEditarAluno = (aluno: Aluno) => {
    setFormAluno(aluno);
    setAlunoSelecionado(aluno);
    setModoEdicao(true);
    setShowForm(true);
  };

  const handleVerFicha = (aluno: Aluno) => {
    setAlunoSelecionado(aluno);
    setActiveTab('ficha');
  };

  const handleExcluirAluno = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      removerAluno(id);
      setMensagem({ tipo: 'sucesso', texto: 'Aluno excluído com sucesso!' });
    }
  };

  const handleLimparTodos = () => {
    if (confirm('Tem certeza que deseja excluir TODOS os alunos? Esta ação não pode ser desfeita!')) {
      limparAlunos();
      setMensagem({ tipo: 'sucesso', texto: 'Todos os alunos foram removidos!' });
    }
  };

  // Imprimir lista
  const handleImprimir = (tipo: 'turma' | 'aee' | 'geral') => {
    let titulo = '';
    let alunosParaImprimir: Aluno[] = [];
    
    if (tipo === 'turma' && turmaSelecionada) {
      titulo = `Lista de Alunos - ${turmaSelecionada}`;
      alunosParaImprimir = alunos.filter(a => a.turma === turmaSelecionada).sort((a, b) => a.numeroChamada - b.numeroChamada);
    } else if (tipo === 'aee') {
      titulo = 'Alunos com Deficiência (AEE)';
      alunosParaImprimir = alunosAEE;
    } else {
      titulo = 'Lista Geral de Alunos';
      alunosParaImprimir = alunos;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; font-size: 10px; padding: 20px; }
            h1 { font-size: 16px; text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #333; padding: 4px 8px; text-align: left; }
            th { background-color: #f0f0f0; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .total { margin-top: 20px; font-weight: bold; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>${titulo}</h1>
          <table>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Nome</th>
                <th>RA</th>
                ${tipo !== 'turma' ? '<th>Turma</th>' : ''}
                <th>Data Nasc.</th>
                <th>Situação</th>
                ${tipo === 'aee' || tipo === 'geral' ? '<th>Deficiência</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${alunosParaImprimir.map((a, i) => `
                <tr>
                  <td>${tipo === 'turma' ? a.numeroChamada : i + 1}</td>
                  <td>${a.nome}</td>
                  <td>${a.ra}${a.dvRa ? '-' + a.dvRa : ''}</td>
                  ${tipo !== 'turma' ? `<td>${a.turma}</td>` : ''}
                  <td>${a.dataNascimento}</td>
                  <td>${a.situacao}</td>
                  ${tipo === 'aee' || tipo === 'geral' ? `<td>${a.deficiencia || '-'}</td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p class="total">Total: ${alunosParaImprimir.length} aluno(s)</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onafterprint = () => printWindow.close();
    setTimeout(() => printWindow.print(), 250);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-500">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mensagem */}
      {mensagem && (
        <div className={`p-4 rounded-lg flex justify-between items-center ${
          mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <span>{mensagem.texto}</span>
          <button onClick={() => setMensagem(null)} className="text-xl">&times;</button>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">👨‍🎓 Cadastro de Alunos</h1>
        <p className="opacity-90">Gerencie o cadastro de alunos da escola</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-indigo-600">{estatisticas.totalAlunos}</div>
          <div className="text-sm text-gray-600">Total Alunos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">{estatisticas.totalAtivos}</div>
          <div className="text-sm text-gray-600">Ativos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">{estatisticas.totalTransferidos}</div>
          <div className="text-sm text-gray-600">Transferidos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">{estatisticas.totalEvadidos}</div>
          <div className="text-sm text-gray-600">Evadidos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-purple-600">{estatisticas.totalComDeficiencia}</div>
          <div className="text-sm text-gray-600">AEE</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{estatisticas.totalTurmas}</div>
          <div className="text-sm text-gray-600">Turmas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-gray-600">{estatisticas.mediaPorTurma}</div>
          <div className="text-sm text-gray-600">Média/Turma</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'lista', label: '📋 Lista de Alunos', badge: alunos.length },
            { id: 'upload', label: '📤 Importar Planilha' },
            { id: 'turmas', label: '🏫 Por Turma', badge: turmas.length },
            { id: 'aee', label: '♿ AEE', badge: alunosAEE.length },
            { id: 'ficha', label: '📄 Ficha do Aluno', hidden: !alunoSelecionado },
          ].filter(t => !t.hidden).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabAlunos)}
              className={`px-6 py-4 font-medium whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* TAB: Lista de Alunos */}
          {activeTab === 'lista' && (
            <div className="space-y-4">
              {/* Barra de ações */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    placeholder="🔍 Buscar por nome, RA ou RM..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-64"
                  />
                  <select
                    value={filtroTurma}
                    onChange={(e) => setFiltroTurma(e.target.value)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    <option value="">Todas as Turmas</option>
                    {turmas.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <select
                    value={filtroSituacao}
                    onChange={(e) => setFiltroSituacao(e.target.value as SituacaoAluno | '')}
                    className="px-4 py-2 border rounded-lg"
                  >
                    <option value="">Todas as Situações</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Transferido">Transferido</option>
                    <option value="Evadido">Evadido</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Remanejado">Remanejado</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { resetForm(); setModoEdicao(false); setShowForm(true); }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    ➕ Novo Aluno
                  </button>
                  <button
                    onClick={() => handleImprimir('geral')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    🖨️ Imprimir
                  </button>
                  {alunos.length > 0 && (
                    <button
                      onClick={handleLimparTodos}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      🗑️ Limpar Todos
                    </button>
                  )}
                </div>
              </div>

              {/* Tabela de alunos */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Nº</th>
                      <th className="px-4 py-3 text-left">Nome</th>
                      <th className="px-4 py-3 text-left">RA</th>
                      <th className="px-4 py-3 text-left">Turma</th>
                      <th className="px-4 py-3 text-left">Data Nasc.</th>
                      <th className="px-4 py-3 text-left">Situação</th>
                      <th className="px-4 py-3 text-left">Deficiência</th>
                      <th className="px-4 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {alunosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          {alunos.length === 0 
                            ? 'Nenhum aluno cadastrado. Importe uma planilha ou adicione manualmente.'
                            : 'Nenhum aluno encontrado com os filtros aplicados.'}
                        </td>
                      </tr>
                    ) : (
                      alunosFiltrados.slice(0, 100).map((aluno) => (
                        <tr key={aluno.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{aluno.numeroChamada}</td>
                          <td className="px-4 py-3 font-medium">{aluno.nome}</td>
                          <td className="px-4 py-3">{aluno.ra}{aluno.dvRa ? `-${aluno.dvRa}` : ''}</td>
                          <td className="px-4 py-3">{aluno.turma}</td>
                          <td className="px-4 py-3">{aluno.dataNascimento}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              aluno.situacao === 'Ativo' ? 'bg-green-100 text-green-800' :
                              aluno.situacao === 'Transferido' ? 'bg-yellow-100 text-yellow-800' :
                              aluno.situacao === 'Evadido' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {aluno.situacao}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {aluno.deficiencia && aluno.deficiencia !== 'Não' && aluno.deficiencia !== 'Nenhuma' ? (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                {aluno.deficiencia}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-1">
                              <button
                                onClick={() => handleVerFicha(aluno)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                title="Ver Ficha"
                              >
                                👁️
                              </button>
                              <button
                                onClick={() => handleEditarAluno(aluno)}
                                className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleExcluirAluno(aluno.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Excluir"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {alunosFiltrados.length > 100 && (
                  <div className="text-center py-4 text-gray-500">
                    Mostrando 100 de {alunosFiltrados.length} alunos. Use os filtros para refinar a busca.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Upload de Planilha */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-2">📋 Formato Esperado da Planilha</h3>
                <p className="text-blue-700 mb-2">A planilha deve conter as seguintes colunas:</p>
                <div className="bg-white rounded p-3 overflow-x-auto">
                  <table className="text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-2 py-1">Ano</th>
                        <th className="px-2 py-1">RM</th>
                        <th className="px-2 py-1">Nº CH</th>
                        <th className="px-2 py-1">Nome do Aluno</th>
                        <th className="px-2 py-1">RA</th>
                        <th className="px-2 py-1">DV RA</th>
                        <th className="px-2 py-1">UF RA</th>
                        <th className="px-2 py-1">Data de Nascimento</th>
                        <th className="px-2 py-1">Situação</th>
                        <th className="px-2 py-1">Deficiência</th>
                        <th className="px-2 py-1">Endereço</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-gray-600">
                        <td className="px-2 py-1">6º A</td>
                        <td className="px-2 py-1">12345</td>
                        <td className="px-2 py-1">1</td>
                        <td className="px-2 py-1">João Silva Santos</td>
                        <td className="px-2 py-1">123456789</td>
                        <td className="px-2 py-1">1</td>
                        <td className="px-2 py-1">SP</td>
                        <td className="px-2 py-1">15/03/2012</td>
                        <td className="px-2 py-1">Ativo</td>
                        <td className="px-2 py-1">-</td>
                        <td className="px-2 py-1">Rua das Flores, 123</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-400'
                }`}
              >
                <div className="text-6xl mb-4">📤</div>
                <h3 className="text-xl font-semibold mb-2">Arraste a planilha aqui</h3>
                <p className="text-gray-500 mb-4">ou clique para selecionar o arquivo</p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload-alunos"
                />
                <label
                  htmlFor="file-upload-alunos"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700"
                >
                  Selecionar Arquivo
                </label>
                <p className="text-sm text-gray-400 mt-4">Formatos aceitos: .xlsx, .xls, .csv</p>
              </div>
            </div>
          )}

          {/* TAB: Por Turma */}
          {activeTab === 'turmas' && (
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <select
                  value={turmaSelecionada}
                  onChange={(e) => setTurmaSelecionada(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">Selecione uma turma...</option>
                  {turmasResumo.map(t => (
                    <option key={t.turma} value={t.turma}>
                      {t.turma} ({t.alunosAtivos} ativos / {t.totalAlunos} total)
                    </option>
                  ))}
                </select>
                {turmaSelecionada && (
                  <button
                    onClick={() => handleImprimir('turma')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    🖨️ Imprimir Lista
                  </button>
                )}
              </div>

              {!turmaSelecionada ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {turmasResumo.map(t => (
                    <button
                      key={t.turma}
                      onClick={() => setTurmaSelecionada(t.turma)}
                      className="p-4 bg-white border rounded-xl hover:shadow-lg transition-shadow text-left"
                    >
                      <div className="text-xl font-bold text-indigo-600">{t.turma}</div>
                      <div className="text-sm text-gray-600 mt-2">
                        <div>👥 Total: {t.totalAlunos}</div>
                        <div>✅ Ativos: {t.alunosAtivos}</div>
                        {t.alunosComDeficiencia > 0 && (
                          <div>♿ AEE: {t.alunosComDeficiencia}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="bg-indigo-50 p-4 border-b">
                    <h3 className="font-bold text-lg">{turmaSelecionada}</h3>
                    <p className="text-sm text-gray-600">
                      {turmasResumo.find(t => t.turma === turmaSelecionada)?.alunosAtivos} alunos ativos
                    </p>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left w-16">Nº</th>
                        <th className="px-4 py-3 text-left">Nome</th>
                        <th className="px-4 py-3 text-left">RA</th>
                        <th className="px-4 py-3 text-left">Data Nasc.</th>
                        <th className="px-4 py-3 text-left">Situação</th>
                        <th className="px-4 py-3 text-left">Deficiência</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {turmasResumo
                        .find(t => t.turma === turmaSelecionada)
                        ?.alunos.map(aluno => (
                          <tr 
                            key={aluno.id} 
                            className={`hover:bg-gray-50 cursor-pointer ${
                              aluno.situacao !== 'Ativo' ? 'opacity-50' : ''
                            }`}
                            onClick={() => handleVerFicha(aluno)}
                          >
                            <td className="px-4 py-3 font-bold">{aluno.numeroChamada}</td>
                            <td className="px-4 py-3">{aluno.nome}</td>
                            <td className="px-4 py-3">{aluno.ra}{aluno.dvRa ? `-${aluno.dvRa}` : ''}</td>
                            <td className="px-4 py-3">{aluno.dataNascimento}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                aluno.situacao === 'Ativo' ? 'bg-green-100 text-green-800' :
                                aluno.situacao === 'Transferido' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {aluno.situacao}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {aluno.deficiencia && aluno.deficiencia !== 'Não' ? (
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                  {aluno.deficiencia}
                                </span>
                              ) : '-'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB: AEE */}
          {activeTab === 'aee' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">♿ Alunos com Deficiência (AEE)</h3>
                <button
                  onClick={() => handleImprimir('aee')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  🖨️ Imprimir Lista
                </button>
              </div>

              {alunosAEE.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">♿</div>
                  <p>Nenhum aluno com deficiência cadastrado.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {alunosAEE.map(aluno => (
                    <div 
                      key={aluno.id}
                      className="bg-white border rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleVerFicha(aluno)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg">{aluno.nome}</h4>
                          <p className="text-gray-600">Turma: {aluno.turma} | Nº {aluno.numeroChamada}</p>
                          <p className="text-gray-600">RA: {aluno.ra}{aluno.dvRa ? `-${aluno.dvRa}` : ''}</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {aluno.deficiencia}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Ficha do Aluno */}
          {activeTab === 'ficha' && alunoSelecionado && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => { setAlunoSelecionado(null); setActiveTab('lista'); setTabFicha('dados'); }}
                  className="text-indigo-600 hover:underline"
                >
                  ← Voltar para a lista
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditarAluno(alunoSelecionado)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    ✏️ Editar
                  </button>
                </div>
              </div>

              <div className="bg-white border rounded-xl overflow-hidden">
                {/* Cabeçalho da Ficha */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl">
                      {alunoSelecionado.foto ? (
                        <img src={alunoSelecionado.foto} alt="Foto" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        '👤'
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{alunoSelecionado.nome}</h2>
                      <p className="opacity-90">Turma: {alunoSelecionado.turma} | Nº {alunoSelecionado.numeroChamada}</p>
                      <p className="opacity-90">RA: {alunoSelecionado.ra}{alunoSelecionado.dvRa ? `-${alunoSelecionado.dvRa}` : ''} / {alunoSelecionado.ufRa}</p>
                    </div>
                  </div>
                </div>

                {/* Sub-abas da Ficha */}
                <div className="flex border-b bg-gray-50">
                  {[
                    { id: 'dados', label: '📋 Dados Gerais' },
                    { id: 'responsaveis', label: '👨‍👩‍👦 Responsáveis', badge: alunoSelecionado.responsaveis?.length || 0 },
                    { id: 'saude', label: '🏥 Ficha de Saúde' },
                    { id: 'ocorrencias', label: '📝 Ocorrências', badge: alunoSelecionado.ocorrencias?.length || 0 },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setTabFicha(tab.id as TabFicha)}
                      className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${
                        tabFicha === tab.id
                          ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {tab.label}
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Conteúdo da Ficha - Dados Gerais */}
                {tabFicha === 'dados' && (
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  {/* Dados Escolares */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-4 text-indigo-600">📚 Dados Escolares</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex"><span className="font-medium w-32">Turma:</span>{alunoSelecionado.turma}</div>
                      <div className="flex"><span className="font-medium w-32">Nº Chamada:</span>{alunoSelecionado.numeroChamada}</div>
                      <div className="flex"><span className="font-medium w-32">RM:</span>{alunoSelecionado.rm || '-'}</div>
                      <div className="flex"><span className="font-medium w-32">RA:</span>{alunoSelecionado.ra}{alunoSelecionado.dvRa ? `-${alunoSelecionado.dvRa}` : ''}</div>
                      <div className="flex"><span className="font-medium w-32">UF RA:</span>{alunoSelecionado.ufRa}</div>
                      <div className="flex">
                        <span className="font-medium w-32">Situação:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          alunoSelecionado.situacao === 'Ativo' ? 'bg-green-100 text-green-800' :
                          alunoSelecionado.situacao === 'Transferido' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {alunoSelecionado.situacao}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dados Pessoais */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-4 text-indigo-600">👤 Dados Pessoais</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex"><span className="font-medium w-32">Nascimento:</span>{alunoSelecionado.dataNascimento}</div>
                      <div className="flex"><span className="font-medium w-32">Idade:</span>{alunoSelecionado.idade} anos</div>
                      <div className="flex">
                        <span className="font-medium w-32">Deficiência:</span>
                        {alunoSelecionado.deficiencia && alunoSelecionado.deficiencia !== 'Não' ? (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">
                            {alunoSelecionado.deficiencia}
                          </span>
                        ) : 'Nenhuma'}
                      </div>
                    </div>
                  </div>

                  {/* Filiação */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-4 text-indigo-600">👨‍👩‍👦 Filiação</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex"><span className="font-medium w-32">Mãe:</span>{alunoSelecionado.nomeMae || '-'}</div>
                      <div className="flex"><span className="font-medium w-32">Pai:</span>{alunoSelecionado.nomePai || '-'}</div>
                      <div className="flex"><span className="font-medium w-32">Responsável:</span>{alunoSelecionado.responsavel || '-'}</div>
                    </div>
                  </div>

                  {/* Contato */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-4 text-indigo-600">📞 Contato</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex"><span className="font-medium w-32">Telefone:</span>{alunoSelecionado.telefone || '-'}</div>
                      <div className="flex"><span className="font-medium w-32">Celular:</span>{alunoSelecionado.celular || '-'}</div>
                      <div className="flex"><span className="font-medium w-32">E-mail:</span>{alunoSelecionado.email || '-'}</div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                    <h3 className="font-bold text-lg mb-4 text-indigo-600">🏠 Endereço</h3>
                    <div className="text-sm">
                      {alunoSelecionado.endereco || 'Endereço não informado'}
                    </div>
                  </div>

                  {/* Observações */}
                  {alunoSelecionado.observacoes && (
                    <div className="bg-yellow-50 rounded-lg p-4 md:col-span-2">
                      <h3 className="font-bold text-lg mb-4 text-yellow-700">📝 Observações</h3>
                      <div className="text-sm text-yellow-800">
                        {alunoSelecionado.observacoes}
                      </div>
                    </div>
                  )}
                </div>
                )}

                {/* Conteúdo da Ficha - Responsáveis */}
                {tabFicha === 'responsaveis' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-indigo-600">👨‍👩‍👦 Responsáveis pelo Aluno</h3>
                      <button
                        onClick={() => { setShowFormResponsavel(true); setResponsavelEditando(null); }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                      >
                        ➕ Adicionar Responsável
                      </button>
                    </div>
                    
                    {(!alunoSelecionado.responsaveis || alunoSelecionado.responsaveis.length === 0) ? (
                      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-4">👨‍👩‍👦</div>
                        <p>Nenhum responsável cadastrado.</p>
                        <p className="text-sm">Clique em "Adicionar Responsável" para cadastrar.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {alunoSelecionado.responsaveis.map((resp: Responsavel) => (
                          <div key={resp.id} className="bg-gray-50 rounded-lg p-4 border">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-lg">{resp.nome}</h4>
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">{resp.parentesco}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { setResponsavelEditando(resp); setShowFormResponsavel(true); }}
                                  className="text-yellow-600 hover:bg-yellow-50 p-1 rounded"
                                >✏️</button>
                              </div>
                            </div>
                            <div className="mt-3 grid md:grid-cols-2 gap-2 text-sm">
                              {resp.telefoneCelular && <div>📱 {resp.telefoneCelular}</div>}
                              {resp.telefoneResidencial && <div>📞 {resp.telefoneResidencial}</div>}
                              {resp.email && <div>📧 {resp.email}</div>}
                              {resp.profissao && <div>💼 {resp.profissao}</div>}
                            </div>
                            <div className="mt-2 flex gap-2 flex-wrap">
                              {resp.responsavelFinanceiro && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">💰 Resp. Financeiro</span>}
                              {resp.responsavelPedagogico && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">📚 Resp. Pedagógico</span>}
                              {resp.autorizadoBuscar && <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">🚗 Autorizado Buscar</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Conteúdo da Ficha - Saúde */}
                {tabFicha === 'saude' && (
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-4 text-indigo-600">🏥 Ficha de Saúde</h3>
                    
                    {!alunoSelecionado.fichaSaude ? (
                      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-4">🏥</div>
                        <p>Ficha de saúde não preenchida.</p>
                        <button 
                          onClick={() => setShowFormSaude(true)}
                          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          ➕ Preencher Ficha de Saúde
                        </button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-red-50 rounded-lg p-4">
                          <h4 className="font-bold text-red-700 mb-3">🚨 Informações de Emergência</h4>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Contato:</span> {alunoSelecionado.fichaSaude.contatoEmergencia}</div>
                            <div><span className="font-medium">Telefone:</span> {alunoSelecionado.fichaSaude.telefoneEmergencia}</div>
                            <div><span className="font-medium">Tipo Sanguíneo:</span> {alunoSelecionado.fichaSaude.tipoSanguineo}</div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-bold text-blue-700 mb-3">📋 Dados Gerais</h4>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Plano de Saúde:</span> {alunoSelecionado.fichaSaude.planoSaude || 'Não informado'}</div>
                            <div><span className="font-medium">Cartão SUS:</span> {alunoSelecionado.fichaSaude.numeroCartaoSus || 'Não informado'}</div>
                            <div><span className="font-medium">Vacinas em dia:</span> {alunoSelecionado.fichaSaude.vacinasEmDia ? '✅ Sim' : '❌ Não'}</div>
                          </div>
                        </div>

                        {alunoSelecionado.fichaSaude.alergias && alunoSelecionado.fichaSaude.alergias.length > 0 && (
                          <div className="bg-yellow-50 rounded-lg p-4">
                            <h4 className="font-bold text-yellow-700 mb-3">⚠️ Alergias</h4>
                            <div className="flex flex-wrap gap-2">
                              {alunoSelecionado.fichaSaude.alergias.map((a: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-sm">{a}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {alunoSelecionado.fichaSaude.medicamentosUso && alunoSelecionado.fichaSaude.medicamentosUso.length > 0 && (
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-bold text-purple-700 mb-3">💊 Medicamentos em Uso</h4>
                            <div className="flex flex-wrap gap-2">
                              {alunoSelecionado.fichaSaude.medicamentosUso.map((m: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-sm">{m}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {alunoSelecionado.fichaSaude.restricoesAlimentares && alunoSelecionado.fichaSaude.restricoesAlimentares.length > 0 && (
                          <div className="bg-orange-50 rounded-lg p-4">
                            <h4 className="font-bold text-orange-700 mb-3">🍽️ Restrições Alimentares</h4>
                            <div className="flex flex-wrap gap-2">
                              {alunoSelecionado.fichaSaude.restricoesAlimentares.map((r: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-sm">{r}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="md:col-span-2 flex gap-2">
                          {alunoSelecionado.fichaSaude.autorizaAtendimentoEmergencia && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">✅ Autoriza atendimento de emergência</span>
                          )}
                          {alunoSelecionado.fichaSaude.autorizaMedicacao && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">✅ Autoriza medicação</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Conteúdo da Ficha - Ocorrências */}
                {tabFicha === 'ocorrencias' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-indigo-600">📝 Ocorrências e Atendimentos</h3>
                      <button
                        onClick={() => { setShowFormOcorrencia(true); setOcorrenciaEditando(null); }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                      >
                        ➕ Nova Ocorrência
                      </button>
                    </div>
                    
                    {(!alunoSelecionado.ocorrencias || alunoSelecionado.ocorrencias.length === 0) ? (
                      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-4">📝</div>
                        <p>Nenhuma ocorrência registrada.</p>
                        <p className="text-sm">Clique em "Nova Ocorrência" para registrar.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {alunoSelecionado.ocorrencias.map((oc: Ocorrencia) => (
                          <div key={oc.id} className={`rounded-lg p-4 border-l-4 ${
                            oc.tipo === 'Disciplinar' ? 'bg-red-50 border-red-500' :
                            oc.tipo === 'Pedagógico' ? 'bg-blue-50 border-blue-500' :
                            oc.tipo === 'Saúde' ? 'bg-green-50 border-green-500' :
                            oc.tipo === 'Elogio' ? 'bg-yellow-50 border-yellow-500' :
                            'bg-gray-50 border-gray-500'
                          }`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold">{oc.titulo}</h4>
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    oc.status === 'Aberto' ? 'bg-yellow-200 text-yellow-800' :
                                    oc.status === 'Em andamento' ? 'bg-blue-200 text-blue-800' :
                                    oc.status === 'Concluído' ? 'bg-green-200 text-green-800' :
                                    'bg-gray-200 text-gray-800'
                                  }`}>{oc.status}</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  📅 {oc.data} {oc.hora && `às ${oc.hora}`} • 
                                  <span className="ml-1 px-2 py-0.5 bg-gray-200 rounded text-xs">{oc.tipo}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => { setOcorrenciaEditando(oc); setShowFormOcorrencia(true); }}
                                className="text-yellow-600 hover:bg-yellow-50 p-1 rounded"
                              >✏️</button>
                            </div>
                            <p className="mt-2 text-sm">{oc.descricao}</p>
                            <div className="mt-2 text-xs text-gray-500">
                              Registrado por: {oc.responsavelRegistro} {oc.cargoResponsavel && `(${oc.cargoResponsavel})`}
                            </div>
                            {oc.providencias && (
                              <div className="mt-2 p-2 bg-white rounded text-sm">
                                <span className="font-medium">Providências:</span> {oc.providencias}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Formulário de Responsável */}
      {showFormResponsavel && alunoSelecionado && (
        <ModalResponsavel
          responsavel={responsavelEditando}
          onSalvar={(resp) => {
            const responsaveis = alunoSelecionado.responsaveis || [];
            if (responsavelEditando) {
              // Editar existente
              const novosResp = responsaveis.map(r => r.id === responsavelEditando.id ? resp : r);
              atualizarAluno(alunoSelecionado.id, { responsaveis: novosResp });
              setAlunoSelecionado({ ...alunoSelecionado, responsaveis: novosResp });
            } else {
              // Adicionar novo
              const novosResp = [...responsaveis, { ...resp, id: `resp-${Date.now()}` }];
              atualizarAluno(alunoSelecionado.id, { responsaveis: novosResp });
              setAlunoSelecionado({ ...alunoSelecionado, responsaveis: novosResp });
            }
            setShowFormResponsavel(false);
            setResponsavelEditando(null);
            setMensagem({ tipo: 'sucesso', texto: 'Responsável salvo com sucesso!' });
          }}
          onCancelar={() => { setShowFormResponsavel(false); setResponsavelEditando(null); }}
        />
      )}

      {/* Modal de Formulário de Ficha de Saúde */}
      {showFormSaude && alunoSelecionado && (
        <ModalFichaSaude
          fichaSaude={alunoSelecionado.fichaSaude || null}
          onSalvar={(ficha) => {
            atualizarAluno(alunoSelecionado.id, { fichaSaude: ficha });
            setAlunoSelecionado({ ...alunoSelecionado, fichaSaude: ficha });
            setShowFormSaude(false);
            setMensagem({ tipo: 'sucesso', texto: 'Ficha de saúde salva com sucesso!' });
          }}
          onCancelar={() => setShowFormSaude(false)}
        />
      )}

      {/* Modal de Formulário de Ocorrência */}
      {showFormOcorrencia && alunoSelecionado && (
        <ModalOcorrencia
          ocorrencia={ocorrenciaEditando}
          onSalvar={(oc) => {
            const ocorrencias = alunoSelecionado.ocorrencias || [];
            if (ocorrenciaEditando) {
              // Editar existente
              const novasOc = ocorrencias.map(o => o.id === ocorrenciaEditando.id ? oc : o);
              atualizarAluno(alunoSelecionado.id, { ocorrencias: novasOc });
              setAlunoSelecionado({ ...alunoSelecionado, ocorrencias: novasOc });
            } else {
              // Adicionar nova
              const novasOc = [...ocorrencias, { ...oc, id: `oc-${Date.now()}` }];
              atualizarAluno(alunoSelecionado.id, { ocorrencias: novasOc });
              setAlunoSelecionado({ ...alunoSelecionado, ocorrencias: novasOc });
            }
            setShowFormOcorrencia(false);
            setOcorrenciaEditando(null);
            setMensagem({ tipo: 'sucesso', texto: 'Ocorrência salva com sucesso!' });
          }}
          onCancelar={() => { setShowFormOcorrencia(false); setOcorrenciaEditando(null); }}
        />
      )}

      {/* Modal de Formulário do Aluno */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">
                {modoEdicao ? '✏️ Editar Aluno' : '➕ Novo Aluno'}
              </h2>
              <button
                onClick={() => { setShowForm(false); setModoEdicao(false); }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Dados Escolares */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-indigo-600">📚 Dados Escolares</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Turma *</label>
                    <input
                      type="text"
                      value={formAluno.turma || ''}
                      onChange={(e) => setFormAluno({...formAluno, turma: e.target.value, ano: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="6º A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nº Chamada</label>
                    <input
                      type="number"
                      value={formAluno.numeroChamada || ''}
                      onChange={(e) => setFormAluno({...formAluno, numeroChamada: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">RM</label>
                    <input
                      type="text"
                      value={formAluno.rm || ''}
                      onChange={(e) => setFormAluno({...formAluno, rm: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Situação</label>
                    <select
                      value={formAluno.situacao || 'Ativo'}
                      onChange={(e) => setFormAluno({...formAluno, situacao: e.target.value as SituacaoAluno})}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Transferido">Transferido</option>
                      <option value="Evadido">Evadido</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Remanejado">Remanejado</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">RA</label>
                    <input
                      type="text"
                      value={formAluno.ra || ''}
                      onChange={(e) => setFormAluno({...formAluno, ra: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">DV RA</label>
                    <input
                      type="text"
                      value={formAluno.dvRa || ''}
                      onChange={(e) => setFormAluno({...formAluno, dvRa: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">UF RA</label>
                    <input
                      type="text"
                      value={formAluno.ufRa || ''}
                      onChange={(e) => setFormAluno({...formAluno, ufRa: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="SP"
                    />
                  </div>
                </div>
              </div>

              {/* Dados Pessoais */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-indigo-600">👤 Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      value={formAluno.nome || ''}
                      onChange={(e) => setFormAluno({...formAluno, nome: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
                    <input
                      type="text"
                      value={formAluno.dataNascimento || ''}
                      onChange={(e) => setFormAluno({...formAluno, dataNascimento: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="DD/MM/AAAA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Deficiência</label>
                    <input
                      type="text"
                      value={formAluno.deficiencia || ''}
                      onChange={(e) => setFormAluno({...formAluno, deficiencia: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="TEA, DI, etc. ou deixe vazio"
                    />
                  </div>
                </div>
              </div>

              {/* Filiação */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-indigo-600">👨‍👩‍👦 Filiação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome da Mãe</label>
                    <input
                      type="text"
                      value={formAluno.nomeMae || ''}
                      onChange={(e) => setFormAluno({...formAluno, nomeMae: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome do Pai</label>
                    <input
                      type="text"
                      value={formAluno.nomePai || ''}
                      onChange={(e) => setFormAluno({...formAluno, nomePai: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Responsável</label>
                    <input
                      type="text"
                      value={formAluno.responsavel || ''}
                      onChange={(e) => setFormAluno({...formAluno, responsavel: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-indigo-600">📞 Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Telefone</label>
                    <input
                      type="text"
                      value={formAluno.telefone || ''}
                      onChange={(e) => setFormAluno({...formAluno, telefone: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Celular</label>
                    <input
                      type="text"
                      value={formAluno.celular || ''}
                      onChange={(e) => setFormAluno({...formAluno, celular: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">E-mail</label>
                    <input
                      type="email"
                      value={formAluno.email || ''}
                      onChange={(e) => setFormAluno({...formAluno, email: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    value={formAluno.endereco || ''}
                    onChange={(e) => setFormAluno({...formAluno, endereco: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-indigo-600">📝 Observações</h3>
                <textarea
                  value={formAluno.observacoes || ''}
                  onChange={(e) => setFormAluno({...formAluno, observacoes: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                  placeholder="Observações sobre o aluno..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
              <button
                onClick={() => { setShowForm(false); setModoEdicao(false); }}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarAluno}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {modoEdicao ? 'Salvar Alterações' : 'Cadastrar Aluno'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
