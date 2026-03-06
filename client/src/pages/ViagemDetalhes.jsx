import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import Sidebar from "../components/Sidebar";

function ViagemDetalhes() {

    const { id } = useParams();

    const [viajantes, setViajantes] = useState([]);
    const [buscaSistema, setBuscaSistema] = useState("");
    const [resultadosBusca, setResultadosBusca] = useState([]);
    const [viajanteSelecionado, setViajanteSelecionado] = useState(null);

    const [buscaLista, setBuscaLista] = useState("");

    const [valor, setValor] = useState("");
    const [loading, setLoading] = useState(true);

    // -------------------------
    // CARREGAR VIAJANTES
    // -------------------------

    const carregarViajantes = async () => {

        const data = await apiFetch(`/viagem-viajantes/?viagem=${id}`);

        if (Array.isArray(data)) setViajantes(data);
        else if (data?.results) setViajantes(data.results);
        else setViajantes([]);
    };

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);
                await carregarViajantes();

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, [id]);

    // -------------------------
    // BUSCAR VIAJANTES SISTEMA
    // -------------------------

    const buscarViajantesSistema = async (texto) => {

        setBuscaSistema(texto);

        if (texto.length < 2) {

            setResultadosBusca([]);
            return;

        }

        const data = await apiFetch(`/viajantes/?search=${texto}`);

        if (Array.isArray(data)) setResultadosBusca(data);
        else if (data?.results) setResultadosBusca(data.results);
        else setResultadosBusca([]);
    };

    // -------------------------
    // ADICIONAR VIAJANTE
    // -------------------------

    const adicionarViajante = async (e) => {

        e.preventDefault();

        if (!viajanteSelecionado) {

            alert("Selecione um viajante");
            return;

        }

        try {

            await apiFetch(`/viagens/${id}/adicionar_viajante/`, {
                method: "POST",
                body: JSON.stringify({
                    viajante_id: viajanteSelecionado.id,
                    status_pagamento: "pendente",
                    valor_total: Number(valor).toFixed(2)
                })
            });

            setBuscaSistema("");
            setValor("");
            setViajanteSelecionado(null);
            setResultadosBusca([]);

            carregarViajantes();

        } catch (error) {

            console.error(error);
            alert("Erro ao adicionar viajante");

        }

    };

    // -------------------------
    // PAGAMENTO
    // -------------------------

    const pagar = async (registro) => {

        const valorPago = prompt(
            `Valor pago (Total ${registro.valor_total})`,
            registro.valor_pago || 0
        );

        if (valorPago === null) return;

        const pago = Number(valorPago);

        let status = "pendente";

        if (pago === 0) status = "pendente";
        else if (pago < registro.valor_total) status = "parcial";
        else status = "pago";

        try {

            await apiFetch(`/viagem-viajantes/${registro.id}/`, {

                method: "PUT",

                body: JSON.stringify({

                    viagem: registro.viagem,
                    viajante_id: registro.viajante.id,
                    valor_total: Number(registro.valor_total).toFixed(2),
                    valor_pago: pago.toFixed(2),
                    status_pagamento: status

                })

            });

            carregarViajantes();

        } catch (error) {

            console.error(error);
            alert("Erro ao atualizar pagamento");

        }

    };

    // -------------------------
    // REMOVER
    // -------------------------

    const remover = async (idRegistro) => {

        if (!window.confirm("Remover viajante da viagem?")) return;

        await apiFetch(`/viagem-viajantes/${idRegistro}/`, {
            method: "DELETE"
        });

        carregarViajantes();

    };

    // -------------------------
    // FILTRO BUSCA NA LISTA
    // -------------------------

    const viajantesFiltrados = viajantes.filter((v) => {

        const nome = v.viajante?.nome_completo?.toLowerCase() || "";
        const cpf = v.viajante?.cpf || "";

        return (
            nome.includes(buscaLista.toLowerCase()) ||
            cpf.includes(buscaLista)
        );

    });

    // -------------------------
    // TOTAIS
    // -------------------------

    const totalViagem = viajantes.reduce((acc, v) => acc + Number(v.valor_total), 0);

    const totalPago = viajantes.reduce((acc, v) => acc + Number(v.valor_pago || 0), 0);

    const totalRestante = totalViagem - totalPago;

    // -------------------------

    return (

        <div style={{ display: "flex" }}>

            <div>

                <h2>Viajantes da Viagem</h2>

                <h3>Resumo Financeiro</h3>

                <p>Total da viagem: <b>R$ {totalViagem}</b></p>
                <p>Total pago: <b>R$ {totalPago}</b></p>
                <p>Restante: <b>R$ {totalRestante}</b></p>

                <hr />

                <h3>Adicionar viajante</h3>

                <form onSubmit={adicionarViajante}>

                    <input
                        placeholder="Buscar viajante (nome ou CPF)"
                        value={buscaSistema}
                        onChange={(e) => buscarViajantesSistema(e.target.value)}
                    />

                    {resultadosBusca.length > 0 && (

                        <ul>

                            {resultadosBusca.map((v) => (

                                <li
                                    key={v.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {

                                        setViajanteSelecionado(v);
                                        setBuscaSistema(v.nome_completo);
                                        setResultadosBusca([]);

                                    }}
                                >
                                    {v.nome_completo} - {v.cpf}
                                </li>

                            ))}

                        </ul>

                    )}

                    <br />

                    <input
                        type="number"
                        placeholder="Valor total"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                    />

                    <button type="submit">Adicionar</button>

                </form>

                <hr />

                <h3>Buscar viajante na viagem</h3>

                <input
                    placeholder="Buscar por nome ou CPF..."
                    value={buscaLista}
                    onChange={(e) => setBuscaLista(e.target.value)}
                />

                <br /><br />

                {loading ? (

                    <p>Carregando...</p>

                ) : (

                    <table border="1">

                        <thead>

                            <tr>

                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Pago</th>
                                <th>Falta</th>
                                <th>Ações</th>

                            </tr>

                        </thead>

                        <tbody>

                            {viajantesFiltrados.map((v) => {

                                const falta = v.valor_total - (v.valor_pago || 0);

                                return (

                                    <tr key={v.id}>

                                        <td>{v.viajante?.nome_completo}</td>

                                        <td>{v.viajante?.cpf}</td>

                                        <td>{v.status_pagamento}</td>

                                        <td>{v.valor_total}</td>

                                        <td>{v.valor_pago || 0}</td>

                                        <td>{falta}</td>

                                        <td>

                                            <button onClick={() => pagar(v)}>
                                                Atualizar Pagamento
                                            </button>

                                            <button onClick={() => remover(v.id)}>
                                                Remover
                                            </button>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

}

export default ViagemDetalhes;