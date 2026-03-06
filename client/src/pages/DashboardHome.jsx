import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function DashboardHome() {

    const [viagens, setViagens] = useState([]);
    const [viajantes, setViajantes] = useState([]);
    const [pagamentos, setPagamentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const carregar = async () => {

            try {

                const viagensData = await apiFetch("/viagens/");
                const viajantesData = await apiFetch("/viajantes/");
                const pagamentosData = await apiFetch("/viagem-viajantes/");

                setViagens(viagensData.results || viagensData);
                setViajantes(viajantesData.results || viajantesData);
                setPagamentos(pagamentosData.results || pagamentosData);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        };

        carregar();

    }, []);

    if (loading) return <p>Carregando...</p>;

    // -------------------------
    // VIAGENS
    // -------------------------

    const planejadas = viagens.filter(v => v.status === "planejada").length;

    const andamento = viagens.filter(v => v.status === "em_andamento").length;

    const finalizadas = viagens.filter(v => v.status === "finalizada").length;

    // -------------------------
    // FINANCEIRO
    // -------------------------

    const faturamento = pagamentos.reduce(
        (acc, p) => acc + Number(p.valor_total || 0),
        0
    );

    const recebido = pagamentos.reduce(
        (acc, p) => acc + Number(p.valor_pago || 0),
        0
    );

    const pendente = faturamento - recebido;

    return (

        <div>

            <h1>Resumo do Sistema</h1>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
                marginTop: "20px"
            }}>

                <Card titulo="Viagens planejadas" valor={planejadas} />
                <Card titulo="Viagens em andamento" valor={andamento} />
                <Card titulo="Viagens finalizadas" valor={finalizadas} />
                <Card titulo="Viajantes cadastrados" valor={viajantes.length} />

                <Card titulo="Faturamento total" valor={`R$ ${faturamento}`} />
                <Card titulo="Total recebido" valor={`R$ ${recebido}`} />
                <Card titulo="Total pendente" valor={`R$ ${pendente}`} />

            </div>

        </div>

    );

}

function Card({ titulo, valor }) {

    return (

        <div style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            background: "#f9f9f9"
        }}>

            <h3>{titulo}</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>
                {valor}
            </p>

        </div>

    );

}

export default DashboardHome;