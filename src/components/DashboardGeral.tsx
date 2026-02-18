import { useMemo } from 'react';
import { Atribuicao, CadastroDocente, Aluno, Servidor } from '../types';

interface Props {
  atribuicoes: Atribuicao[];
  docentes: CadastroDocente[];
  alunos: Aluno[];
  servidores: Servidor[];
  escola: {
    nome?: string;
    tiposEnsino?: string[];
    turnos?: Array<{ nome: string; ativo: boolean }>;
    diretor?: string;
    endereco?: {
      logradouro?: string;
      numero?: string;
      bairro?: string;
      cidade?: string;
    };
  };
}

export default function DashboardGeral({ atribuicoes, docentes, alunos, servidores, escola }: Props) {
  // Debug - verificar dados recebidos
  console.log('📊 DashboardGeral - Dados recebidos:', {
    escola,
    totalDocentes: docentes?.length,
    totalAlunos: alunos?.length,
    totalServidores: servidores?.length
  });

  // Garantir que os arrays existam
  const docentesArray = Array.isArray(docentes) ? docentes : [];
  const servidoresArray = Array.isArray(servidores) ? servidores : [];
  const alunosArray = Array.isArray(alunos) ? alunos : [];
  const atribuicoesArray = Array.isArray(atribuicoes) ? atribuicoes : [];

  // Calcular docentes únicos das atribuições (para quando não há cadastro de docentes)
  const docentesDeAtribuicoes = useMemo(() => {
    return [...new Set(atribuicoesArray.map(a => a.docente))];
  }, [atribuicoesArray]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const turmas = [...new Set(atribuicoesArray.map(a => a.turma))];
    const disciplinas = [...new Set(atribuicoesArray.map(a => a.disciplina))];
    const alunosAtivos = alunosArray.filter(a => a.situacao === 'Ativo' || !a.situacao);
    const alunosAEE = alunosArray.filter(a => a.deficiencia && a.deficiencia.trim() !== '');
    const servidoresAtivos = servidoresArray.filter(s => s.situacao === 'ativo' || !s.situacao);
    
    // Usar o maior valor entre docentes cadastrados e docentes das atribuições
    const totalDocentes = Math.max(docentesArray.length, docentesDeAtribuicoes.length);
    
    return {
      totalAlunos: alunosArray.length,
      alunosAtivos: alunosAtivos.length,
      alunosAEE: alunosAEE.length,
      totalDocentes: totalDocentes,
      totalServidores: servidoresArray.length,
      servidoresAtivos: servidoresAtivos.length,
      totalTurmas: turmas.length,
      totalDisciplinas: disciplinas.length,
      totalAulas: atribuicoesArray.reduce((sum, a) => sum + a.aulas, 0),
      turmas,
      disciplinas
    };
  }, [atribuicoesArray, docentesArray, alunosArray, servidoresArray, docentesDeAtribuicoes]);

  // Alunos por turma
  const alunosPorTurma = useMemo(() => {
    const grupos: Record<string, number> = {};
    alunosArray.forEach(aluno => {
      const turma = aluno.turma || 'Sem Turma';
      grupos[turma] = (grupos[turma] || 0) + 1;
    });
    return Object.entries(grupos).sort((a, b) => a[0].localeCompare(b[0]));
  }, [alunosArray]);

  // Docentes por cargo (do cadastro ou das atribuições)
  const docentesPorCargo = useMemo(() => {
    const grupos: Record<string, number> = {};
    
    if (docentesArray.length > 0) {
      // Usar dados do cadastro de docentes
      docentesArray.forEach(doc => {
        const cargo = doc.cargo || 'Não informado';
        grupos[cargo] = (grupos[cargo] || 0) + 1;
      });
    } else if (docentesDeAtribuicoes.length > 0) {
      // Usar dados das atribuições
      docentesDeAtribuicoes.forEach(() => {
        grupos['Docente'] = (grupos['Docente'] || 0) + 1;
      });
    }
    
    return Object.entries(grupos).sort((a, b) => b[1] - a[1]);
  }, [docentesArray, docentesDeAtribuicoes]);

  // Servidores por cargo
  const servidoresPorCargo = useMemo(() => {
    const grupos: Record<string, number> = {};
    servidoresArray.forEach(srv => {
      const cargo = srv.cargo || 'Não informado';
      grupos[cargo] = (grupos[cargo] || 0) + 1;
    });
    return Object.entries(grupos).sort((a, b) => b[1] - a[1]);
  }, [servidoresArray]);

  // Aulas por disciplina
  const aulasPorDisciplina = useMemo(() => {
    const grupos: Record<string, number> = {};
    atribuicoesArray.forEach(attr => {
      grupos[attr.disciplina] = (grupos[attr.disciplina] || 0) + attr.aulas;
    });
    return Object.entries(grupos).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [atribuicoesArray]);

  // Cores para gráficos
  const cores = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-orange-500',
    'bg-teal-500', 'bg-cyan-500'
  ];

  // Função para calcular a largura da barra
  const calcularLargura = (valor: number, max: number) => {
    return Math.max((valor / max) * 100, 5);
  };

  // Informações da escola
  const enderecoFormatado = useMemo(() => {
    if (!escola.endereco) return '';
    const { logradouro, numero, bairro, cidade } = escola.endereco;
    const partes = [logradouro, numero, bairro, cidade].filter(Boolean);
    return partes.join(', ');
  }, [escola.endereco]);

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">📊 Dashboard Geral</h1>
        <p className="text-blue-100 mt-1 text-lg">
          🏫 {escola.nome || 'Escola não cadastrada'}
        </p>
        {enderecoFormatado && (
          <p className="text-blue-200 text-sm mt-1">
            📍 {enderecoFormatado}
          </p>
        )}
        {escola.diretor && (
          <p className="text-blue-200 text-sm mt-1">
            👔 Diretor(a): {escola.diretor}
          </p>
        )}
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-600">{stats.totalAlunos}</div>
          <div className="text-gray-600 text-sm">Total de Alunos</div>
          <div className="text-xs text-green-600 mt-1">
            {stats.alunosAtivos} ativos
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
          <div className="text-3xl font-bold text-purple-600">{stats.alunosAEE}</div>
          <div className="text-gray-600 text-sm">Alunos AEE</div>
          <div className="text-xs text-purple-600 mt-1">
            {stats.totalAlunos > 0 ? ((stats.alunosAEE / stats.totalAlunos) * 100).toFixed(1) : 0}% do total
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <div className="text-3xl font-bold text-green-600">{stats.totalDocentes}</div>
          <div className="text-gray-600 text-sm">Docentes</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
          <div className="text-3xl font-bold text-orange-600">{stats.totalServidores}</div>
          <div className="text-gray-600 text-sm">Servidores</div>
          <div className="text-xs text-green-600 mt-1">
            {stats.servidoresAtivos} ativos
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-teal-500">
          <div className="text-3xl font-bold text-teal-600">{stats.totalTurmas}</div>
          <div className="text-gray-600 text-sm">Turmas</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-pink-500">
          <div className="text-3xl font-bold text-pink-600">{stats.totalAulas}</div>
          <div className="text-gray-600 text-sm">Total de Aulas</div>
          <div className="text-xs text-gray-500 mt-1">
            semanais
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alunos por Turma */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            👨‍🎓 Alunos por Turma
          </h2>
          {alunosPorTurma.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum aluno cadastrado</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alunosPorTurma.map(([turma, qtd], idx) => {
                const maxQtd = Math.max(...alunosPorTurma.map(([, q]) => q));
                return (
                  <div key={turma} className="flex items-center gap-3">
                    <div className="w-20 text-sm font-medium text-gray-700 truncate">{turma}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full ${cores[idx % cores.length]} rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                        style={{ width: `${calcularLargura(qtd, maxQtd)}%` }}
                      >
                        <span className="text-white text-xs font-bold">{qtd}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Aulas por Disciplina */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            📚 Aulas por Disciplina (Top 10)
          </h2>
          {aulasPorDisciplina.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhuma atribuição cadastrada</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {aulasPorDisciplina.map(([disciplina, qtd], idx) => {
                const maxQtd = Math.max(...aulasPorDisciplina.map(([, q]) => q));
                return (
                  <div key={disciplina} className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium text-gray-700 truncate" title={disciplina}>
                      {disciplina}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full ${cores[idx % cores.length]} rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                        style={{ width: `${calcularLargura(qtd, maxQtd)}%` }}
                      >
                        <span className="text-white text-xs font-bold">{qtd}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Docentes por Cargo */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            👨‍🏫 Docentes por Cargo
          </h2>
          {docentesPorCargo.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum docente cadastrado</p>
          ) : (
            <div className="space-y-3">
              {docentesPorCargo.map(([cargo, qtd], idx) => {
                const maxQtd = Math.max(...docentesPorCargo.map(([, q]) => q));
                return (
                  <div key={cargo} className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium text-gray-700 truncate" title={cargo}>
                      {cargo}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full ${cores[idx % cores.length]} rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                        style={{ width: `${calcularLargura(qtd, maxQtd)}%` }}
                      >
                        <span className="text-white text-xs font-bold">{qtd}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Servidores por Cargo */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            👷 Servidores por Cargo
          </h2>
          {servidoresPorCargo.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum servidor cadastrado</p>
          ) : (
            <div className="space-y-3">
              {servidoresPorCargo.map(([cargo, qtd], idx) => {
                const maxQtd = Math.max(...servidoresPorCargo.map(([, q]) => q));
                return (
                  <div key={cargo} className="flex items-center gap-3">
                    <div className="w-32 text-sm font-medium text-gray-700 truncate" title={cargo}>
                      {cargo}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full ${cores[idx % cores.length]} rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                        style={{ width: `${calcularLargura(qtd, maxQtd)}%` }}
                      >
                        <span className="text-white text-xs font-bold">{qtd}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Resumo Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2">🏫 Escola</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Nome: {escola.nome || 'Não cadastrado'}</li>
              <li>• Turnos ativos: {escola.turnos?.filter(t => t.ativo).length || 0}</li>
              <li>• Tipos de ensino: {escola.tiposEnsino?.length || 0}</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2">👥 Pessoas</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Alunos: {stats.totalAlunos}</li>
              <li>• Docentes: {stats.totalDocentes}</li>
              <li>• Servidores: {stats.totalServidores}</li>
              <li>• <strong>Total: {stats.totalAlunos + stats.totalDocentes + stats.totalServidores}</strong></li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2">📚 Ensino</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Turmas: {stats.totalTurmas}</li>
              <li>• Disciplinas: {stats.totalDisciplinas}</li>
              <li>• Aulas semanais: {stats.totalAulas}</li>
              <li>• Média alunos/turma: {stats.totalTurmas > 0 ? Math.round(stats.totalAlunos / stats.totalTurmas) : 0}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
