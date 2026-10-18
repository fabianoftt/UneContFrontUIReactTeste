import { useCallback } from "react";
import NotaFiscalTable from "./componentes/NotasFiscalTable";
import CadastroNotaFiscal from "./componentes/CadastroNotaFiscal";

function App() {
  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div>
      <CadastroNotaFiscal onAdd={reload} />
      <NotaFiscalTable />
    </div>
  );
}

export default App;
