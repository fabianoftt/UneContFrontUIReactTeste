import { useEffect, useState } from "react";
import api from "../services/api";
import "./notasFiscalTable.css";

interface NotaFiscal {
  numeroNotaFiscal: number;
  nomeCliente: string;
  valorNotaFiscal: number; // numérico
  valorNotaFiscalFormatado: string; // string formatada
  dataEmissao: string;
  dataCadastroNotaFiscal: string;
}

export default function NotaFiscalTable() {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [busca, setBusca] = useState("");
  const [ordemAsc, setOrdemAsc] = useState(true);

  const carregarNotas = async () => {
    const response = await api.get("/notas");

    // força conversão para número
    const notasConvertidas = response.data.notaFiscal.map((n: NotaFiscal) => ({
      ...n,
      valorNotaFiscal: Number(n.valorNotaFiscal),
    }));

    setNotas(notasConvertidas);
  };

  const excluirNota = async (id: number) => {
    await api.delete(`/notas/${id}`);
    await carregarNotas();
  };

  useEffect(() => {
    carregarNotas();
  }, []);

  // Filtro por nome do cliente
  const notasFiltradas = notas.filter((n) =>
    n.nomeCliente.toLowerCase().includes(busca.toLowerCase()),
  );

  // Ordenação apenas pelo valor numérico
  const notasOrdenadas = [...notasFiltradas].sort((a, b) => {
    const valorA = a.valorNotaFiscal;
    const valorB = b.valorNotaFiscal;
    return ordemAsc ? valorA - valorB : valorB - valorA;
  });

  const alternarOrdenacao = () => {
    setOrdemAsc((prev) => !prev);
  };

  return (
    <div className="tabela-container">
      <h2>Notas Fiscais</h2>

      <input
        type="text"
        placeholder="Buscar por cliente..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="filtro-input"
      />

      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Cliente</th>
            <th onClick={alternarOrdenacao} style={{ cursor: "pointer" }}>
              Valor NF {ordemAsc ? "▲" : "▼"}
            </th>
            <th>Data de Emissão</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {notasOrdenadas.map((n) => (
            <tr key={n.numeroNotaFiscal}>
              <td>{n.numeroNotaFiscal}</td>
              <td>{n.nomeCliente}</td>
              <td>{n.valorNotaFiscalFormatado}</td>
              <td>
                {n.dataEmissao
                  ? new Date(n.dataEmissao).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "—"}
              </td>
              <td>
                <button
                  className="excluir"
                  onClick={() => excluirNota(n.numeroNotaFiscal)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
