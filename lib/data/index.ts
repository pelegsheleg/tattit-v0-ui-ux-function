import { getSupabaseServerClient, getSupabaseServiceClient } from "@/lib/supabase/server"

// Function to insert data into a table
export async function insertData(table: string, data: any, cacheKeys: string[] = []) {
  // Use the service role client to bypass RLS policies
  const supabase = getSupabaseServiceClient()

  const { data: insertedData, error } = await supabase.from(table).insert(data).select()

  return { data: insertedData, error, cacheKeys }
}

// Function to update data in a table
export async function updateData(table: string, id: any, data: any, idColumn = "id", cacheKeys: string[] = []) {
  const supabase = getSupabaseServerClient()

  const { data: updatedData, error } = await supabase.from(table).update(data).eq(idColumn, id).select()

  return { data: updatedData, error, cacheKeys }
}

// Function to delete data from a table
export async function deleteData(table: string, id: any, idColumn = "id", cacheKeys: string[] = []) {
  const supabase = getSupabaseServerClient()

  const { data: deletedData, error } = await supabase.from(table).delete().eq(idColumn, id).select()

  return { data: deletedData, error, success: !error, cacheKeys }
}

// Function to get data from a table
export async function getData(table: string, id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from(table).select().eq("id", id)

  return { data, error }
}

// Function to get all data from a table
export async function getAllData(table: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from(table).select()

  return { data, error }
}

// Generic function to fetch data with caching
export async function fetchData<T>(
  cacheKey: string,
  fetchFunction: (supabase: any) => any,
  revalidate?: number,
): Promise<T | null> {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await fetchFunction(supabase)

    if (error) {
      console.error(`Error fetching data for ${cacheKey}:`, error)
      return null
    }

    return data
  } catch (error) {
    console.error(`Unexpected error fetching data for ${cacheKey}:`, error)
    return null
  }
}
