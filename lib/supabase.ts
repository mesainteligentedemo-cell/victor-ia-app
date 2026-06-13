import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'starter' | 'pro' | 'enterprise';
  credits: number;
  createdAt: string;
}

export interface Chat {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  tokensUsed: number;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  progress: number;
  deadline: string;
  teamCount: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  company: string;
  type: string;
  stage: 'prospect' | 'proposal' | 'authorized' | 'completed';
  value: number;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  role: string;
  specialty: string;
  model: string;
  status: 'active' | 'idle' | 'thinking';
  tasksCompleted: number;
  uptime: number;
  createdAt: string;
}

export interface Asset {
  id: string;
  userId: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'web';
  url: string;
  size: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventData: Record<string, any>;
  timestamp: string;
}

// Database functions
export async function createUser(user: Omit<User, 'id' | 'createdAt'>) {
  const { data, error } = await supabase.from('users').insert([user]).select();
  if (error) throw error;
  return data[0];
}

export async function getUser(userId: string) {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select();
  if (error) throw error;
  return data[0];
}

export async function saveMessage(message: Omit<Message, 'id' | 'createdAt'>) {
  const { data, error } = await supabase.from('messages').insert([message]).select();
  if (error) throw error;
  return data[0];
}

export async function getChatMessages(chatId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chatId', chatId)
    .order('createdAt', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase.from('projects').insert([project]).select();
  if (error) throw error;
  return data[0];
}

export async function getProjects(userId: string) {
  const { data, error } = await supabase.from('projects').select('*').eq('userId', userId);
  if (error) throw error;
  return data;
}

export async function createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase.from('clients').insert([client]).select();
  if (error) throw error;
  return data[0];
}

export async function getClients(userId: string) {
  const { data, error } = await supabase.from('clients').select('*').eq('userId', userId);
  if (error) throw error;
  return data;
}

export async function saveAnalyticsEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) {
  const { data, error } = await supabase
    .from('analytics_events')
    .insert([{ ...event, timestamp: new Date().toISOString() }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function getAnalyticsData(userId: string, days: number = 7) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('userId', userId)
    .gte('timestamp', startDate)
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data;
}