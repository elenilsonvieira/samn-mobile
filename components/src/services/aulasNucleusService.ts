import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, nowTs } from "../fireBaseConfig";
import { AulaNucleo, NovaAulaNucleo } from "../types/aulasNucleus";

import { auth } from "../fireBaseConfig";
import { getDoc } from "firebase/firestore";

const COL = "aulas_nucleo";
const CACHE_KEY = "cache:aulas_nucleo";

const mapDoc = (d: any): AulaNucleo => ({
  id: d.id,
  materia: d.data().materia,
  dataHora: (d.data().dataHora as Timestamp).toDate(),
  local: d.data().local,
  frequencia: d.data().frequencia,
  descricao: d.data().descricao,
  uid: d.data().uid ?? "",
  matricula: d.data().matricula ?? "",
  criadoEm: d.data().criadoEm?.toDate?.() ?? null,
  atualizadoEm: d.data().atualizadoEm?.toDate?.() ?? null,
});

async function obterPerfilUsuario(uid: string) {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Perfil de Usuário não encontrado");
  return snap.data() as { matricula: string; nome: string };
}

export async function criarAulaNucleo(input: NovaAulaNucleo) {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  const perfil = await obterPerfilUsuario(user.uid);

  await addDoc(collection(db, COL), {
    atualizadoEm: nowTs(),
    criadoEm: nowTs(),
    dataHora: Timestamp.fromDate(input.dataHora),
    descricao: input.descricao ?? "",
    frequencia: input.frequencia,
    local: input.local,
    materia: input.materia,
    matricula: perfil.matricula,
    nome: perfil.nome,
    uid: user.email,
  });
}

export async function listarAulasNucleo(): Promise<AulaNucleo[]> {
  const q = query(collection(db, COL), orderBy("dataHora", "asc"));
  const snap = await getDocs(q);
  const aulas = snap.docs.map(mapDoc);
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(aulas));
  return aulas;
}

export async function buscarAulaPorId(id: string): Promise<AulaNucleo | null> {
  const ref = doc(db, COL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapDoc(snap);
}

export async function listarAulasNucleoDoCache(): Promise<AulaNucleo[] | null> {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw) as AulaNucleo[];
    return arr.map((a) => ({ ...a, dataHora: new Date(a.dataHora) }));
  } catch {
    return null;
  }
}

export function observarAulasNucleo(onChange: (aulas: AulaNucleo[]) => void) {
  const q = query(collection(db, COL), orderBy("dataHora", "asc"));
  return onSnapshot(q, async (snap) => {
    const aulas = snap.docs.map(mapDoc);
    onChange(aulas);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(aulas));
  });
}

export async function atualizarAulaNucleo(
  id: string,
  patch: Partial<NovaAulaNucleo>
) {
  const ref = doc(db, COL, id);
  const data: any = { atualizadoEm: nowTs() };
  if (patch.materia !== undefined) data.materia = patch.materia;
  if (patch.local !== undefined) data.local = patch.local;
  if (patch.frequencia !== undefined) data.frequencia = patch.frequencia;
  if (patch.descricao !== undefined) data.descricao = patch.descricao;
  if (patch.dataHora !== undefined)
    data.dataHora = Timestamp.fromDate(patch.dataHora);
  await updateDoc(ref, data);
}

export async function excluirAulaNucleo(id: string) {
  await deleteDoc(doc(db, COL, id));
}
