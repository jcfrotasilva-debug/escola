import { useState, useEffect } from 'react';

type Tema = 'claro' | 'escuro';

export function useTema() {
  const [tema, setTema] = useState<Tema>(() => {
    const saved = localStorage.getItem('tema');
    return (saved as Tema) || 'claro';
  });

  useEffect(() => {
    localStorage.setItem('tema', tema);
    
    // Aplica a classe no documento
    if (tema === 'escuro') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [tema]);

  const alternarTema = () => {
    setTema(tema === 'claro' ? 'escuro' : 'claro');
  };

  return { tema, setTema, alternarTema };
}
