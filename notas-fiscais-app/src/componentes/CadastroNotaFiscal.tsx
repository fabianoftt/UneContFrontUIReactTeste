import { useState } from "react";
import api from "../services/api";
import "./cadastroNotaFiscal.css";
import Swal from "sweetalert2";
import { NumericFormat } from "react-number-format";

interface Props {
  onAdd: () => void;
}

export default function CadastroNotaFiscal({ onAdd }: Props) {
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState(0);
  const [nomeCliente, setNomeCliente] = useState("");
  const [valorNotaFiscal, setValorNotaFiscal] = useState(0);
  const [dataEmissao, setDataEmissao] = useState("");

  const cadastrar = async (e: React.FormEvent) => {
    e.preventDefault(); // evita reload da página

    const valido = validarCampos(
      numeroNotaFiscal,
      valorNotaFiscal,
      nomeCliente,
      dataEmissao,
    );
    if (!valido) return;

    try {
      await api.post("/notas", {
        numeroNotaFiscal,
        nomeCliente,
        valorNotaFiscal,
        dataEmissao,
      });
      await onAdd();

      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Nota fiscal cadastrada com sucesso!",
        confirmButtonColor: "#4da6ff",
      });

      // resetar campos
      setNumeroNotaFiscal(0);
      setNomeCliente("");
      setValorNotaFiscal(0);
      setDataEmissao("");
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível cadastrar a nota.",
        confirmButtonColor: "#ff6666",
      });
    }
  };

  function validarCampos(
    numeroNotaFiscal: number,
    valorNotaFiscal: number,
    nomeCliente: string,
    dataEmissao: string,
  ): boolean {
    if (numeroNotaFiscal <= 0) {
      Swal.fire({
        icon: "error",
        title: "Valor inválido",
        text: "O Número da nota fiscal deve ser maior que zero!",
        confirmButtonColor: "#4da6ff",
      });
      return false;
    }
    if (valorNotaFiscal <= 0) {
      Swal.fire({
        icon: "error",
        title: "Valor inválido",
        text: "O valor da nota deve ser maior que zero!",
        confirmButtonColor: "#4da6ff",
      });
      return false;
    }
    if (!nomeCliente.trim()) {
      Swal.fire({
        icon: "error",
        title: "Campo obrigatório",
        text: "O nome do cliente é obrigatório!",
        confirmButtonColor: "#4da6ff",
      });
      return false;
    }
    if (!dataEmissao) {
      Swal.fire({
        icon: "error",
        title: "Campo obrigatório",
        text: "Informe a data de emissão!",
        confirmButtonColor: "#4da6ff",
      });
      return false;
    }
    const data = new Date(dataEmissao);
    if (isNaN(data.getTime())) {
      Swal.fire({
        icon: "error",
        title: "Data inválida",
        text: "A data informada não é válida!",
        confirmButtonColor: "#4da6ff",
      });
      return false;
    }
    return true;
  }

  return (
    <form className="form-container" onSubmit={cadastrar}>
      <h2>Cadastro de Nota Fiscal</h2>

      <div className="form-group">
        <label>N° da Nota:</label>
        <input
          type="number"
          placeholder="Número da Nota"
          value={numeroNotaFiscal}
          onChange={(e) => setNumeroNotaFiscal(Number(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label>Nome Cliente:</label>
        <input
          type="text"
          placeholder="Nome do Cliente"
          required
          value={nomeCliente}
          onChange={(e) => setNomeCliente(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Valor NF:</label>
        <NumericFormat
          value={valorNotaFiscal}
          thousandSeparator="."
          decimalSeparator=","
          prefix="R$ "
          onValueChange={(values) => {
            const { floatValue } = values;
            setValorNotaFiscal(floatValue || 0);
          }}
        />
      </div>

      <div className="form-group">
        <label>Data Emissão:</label>
        <input
          type="datetime-local"
          placeholder="Data de Emissão"
          value={dataEmissao}
          onChange={(e) => setDataEmissao(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="cadastrar">
          Cadastrar
        </button>
        <button type="button" className="atualizar" onClick={onAdd}>
          Atualizar
        </button>
      </div>
    </form>
  );
}
