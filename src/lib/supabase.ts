import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yuyazovjkqchmuzvkhnc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1eWF6b3Zqa3FjaG11enZraG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MTI1NTUsImV4cCI6MjA5MzA4ODU1NX0.Z9ZY8StXhxC6Rpqjl5V55QCvcAjwGkTklbh-Yxve0UA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
