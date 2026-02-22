import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useAnimeStore() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchAnime = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('anime')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) { console.error(error); setError(error.message) }
    else setList(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAnime()

    // Real-time subscription
    const channel = supabase
      .channel('anime-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'anime' }, fetchAnime)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchAnime])

  const addAnime = useCallback(async ({ name, poster = '', description = '' }) => {
    const { data, error } = await supabase
      .from('anime')
      .insert([{ name, poster, description }])
      .select()
      .single()
    if (error) throw error
    setList(prev => [data, ...prev])
    return data
  }, [])

  const removeAnime = useCallback(async (id) => {
    const { error } = await supabase.from('anime').delete().eq('id', id)
    if (error) throw error
    setList(prev => prev.filter(a => a.id !== id))
  }, [])

  const hasAnime = useCallback((name) =>
    list.some(a => a.name.toLowerCase() === name.toLowerCase()),
  [list])

  return { list, loading, error, addAnime, removeAnime, hasAnime, refetch: fetchAnime }
}
