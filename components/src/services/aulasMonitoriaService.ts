// src/services/aulasMonitoriaService.ts
import {
  addDoc, collection, doc, getDocs, onSnapshot,
  orderBy, query, Timestamp, updateDoc, deleteDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, nowTs } from "../fireBaseConfig";
import {AulaMonitoria, NovaAulaMonitoria} from "../types/aulasMonitoria"

const COL = "aulas_monitoria";
const CACHE_KEY = "cache:aulas_monitoria";

const mapDoc = (d: any): AulaMonitoria => ({
  id: d.id,
  materia: d.data().materia,
  dataHora: (d.data().dataHora as Timestamp).toDate(),
  local: d.data().local,
  frequencia: d.data().frequencia,
  descricao: d.data().descricao,
  Uid: d.data().Uid ?? "",
  Matricula: d.data().Matricula ?? "",
  criadoEm: d.data().criadoEm?.toDate?.() ?? null,
  atualizadoEm: d.data().atualizadoEm?.toDate?.() ?? null,
});


import { auth } from "../fireBaseConfig";
import { getDoc } from "firebase/firestore";

async function obterPerfilUsuario(uid: string) {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Perfil de Usuário não encontrado");
  return snap.data() as { matricula: string };
}

export async function criarAulaMonitoria(input: NovaAulaMonitoria) {
  // Simulação de usuário logado (apenas para teste)
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  // Simulação do perfil do monitor
  const perfil = await obterPerfilUsuario(user.uid);

  await addDoc(collection(db, COL), {
    materia: input.materia,  // <-- aqui mudou de disciplina para materia
    dataHora: Timestamp.fromDate(input.dataHora),
    local: input.local,
    frequencia: input.frequencia,
    descricao: input.descricao ?? "",
    Uid: user.email,
    Matricula: perfil.matricula,
    criadoEm: nowTs(),
    atualizadoEm: nowTs(),
  });
}

export async function listarAulasMonitoria(): Promise<AulaMonitoria[]> {
  const q = query(collection(db, COL), orderBy("dataHora", "asc"));
  const snap = await getDocs(q);
  const aulas = snap.docs.map(mapDoc);
  // atualiza cache
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(aulas));
  return aulas;
}

export async function listarAulasMonitoriaDoCache(): Promise<AulaMonitoria[] | null> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw) as AulaMonitoria[];
    // reconstroi Date
    return arr.map(a => ({ ...a, dataHora: new Date(a.dataHora) }));
  } catch {
    return null;
  }
}

export function observarAulasMonitoria(
  onChange: (aulas: AulaMonitoria[]) => void
) {
  const q = query(collection(db, COL), orderBy("dataHora", "asc"));
  return onSnapshot(q, async (snap) => {
    const aulas = snap.docs.map(mapDoc);
    onChange(aulas);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(aulas));
  });
}

export async function atualizarAulaMonitoria(
  id: string,
  patch: Partial<NovaAulaMonitoria>
) {
  const ref = doc(db, COL, id);
  const data: any = { atualizadoEm: nowTs() };
  if (patch.materia !== undefined) data.materia = patch.materia;
  if (patch.local !== undefined) data.local = patch.local;
  if (patch.frequencia !== undefined) data.frequencia = patch.frequencia;
  if (patch.descricao !== undefined) data.descricao = patch.descricao;
  if (patch.dataHora !== undefined) data.dataHora = Timestamp.fromDate(patch.dataHora);
  await updateDoc(ref, data);
}

export async function excluirAulaMonitoria(id: string) {
  await deleteDoc(doc(db, COL, id));
}
