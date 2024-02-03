import { supabase } from "@/lib/supabase"
import { useState } from "react"

export const useArticles = () => {
  const [articles, setArticles] = useState<any[]>([])

  const getArticles = async () => {
    const { data, error} = await supabase
      .from('articles')
      .select('*, votes(*)')
    
    if (data) {
      console.log(data)
      setArticles(data)
    }else{
      throw new Error(error.message)
    }
  }

  const newVote = async (article_id: number, remove: boolean = false) => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();

     if (!session) return alert('You are not authenticated');
    // if (!session) {
    //   console.error('You are not authenticated');
    //   return;  // Prevent further execution
    // }

    const { user: { id } } = session;

    if (remove) {
      const { data} = await supabase
        .from('votes')
        .delete()
        .eq('article_id', article_id)
        .eq('user_id', id)
      console.log('Vote removed:', data);
      return data
    }

    const { data} = await supabase
      .from('votes')
      .insert({
        article_id,
        user_id: id
      })  
      .select()
      .single()
      console.log('New vote:', data);
    return data
  }

  return {
    articles,
    getArticles,
    newVote
  }
}