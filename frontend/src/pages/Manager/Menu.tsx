import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  createProduct,
  deleteProduct,
  getRestaurantProducts,
  updateProduct,
} from '../../lib/api'
import type { ProductRecord } from '../../types/api'

import { type ManagerRestaurantContext } from './RestaurantWorkspace'
import * as S from './styles'

type ProductFormState = {
  name: string
  price: string
}

const initialFormState: ProductFormState = {
  name: '',
  price: ''
}

const ManagerMenu = () => {
  const { restaurant } = useOutletContext<ManagerRestaurantContext>()
  const moneyFormatter = useMemo(
    () => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  )

  const [products, setProducts] = useState<ProductRecord[]>([])
  const [form, setForm] = useState<ProductFormState>(initialFormState)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getRestaurantProducts(restaurant.id, {
        page: 1,
        pageSize: 100
      })

      setProducts(response.data)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : 'Unable to load menu.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant.id])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setSaving(true)
      setMessage('')
      setError('')

      if (editingProductId === null) {
        await createProduct(restaurant.id, {
          name: form.name.trim(),
          price: Number(form.price)
        })
        setMessage('Produto criado com sucesso.')
      } else {
        await updateProduct(restaurant.id, editingProductId, {
          name: form.name.trim(),
          price: Number(form.price)
        })
        setMessage('Produto atualizado com sucesso.')
      }

      setForm(initialFormState)
      setEditingProductId(null)
      await loadProducts()
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : 'Unable to save product.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product: ProductRecord) => {
    setEditingProductId(product.id)
    setForm({
      name: product.name,
      price: String(product.price)
    })
  }

  const handleDelete = async (productId: number) => {
    try {
      setSaving(true)
      setMessage('')
      await deleteProduct(restaurant.id, productId)
      await loadProducts()
      setMessage('Produto removido.')
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Unable to delete product.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <S.Section>
      <S.Toolbar>
        <div>
          <S.Kicker>Menu</S.Kicker>
          <h2>Cardápio de {restaurant.name}</h2>
        </div>
        <span>{loading ? 'Carregando...' : `${products.length} itens`}</span>
      </S.Toolbar>

      {error ? <S.Notice>{error}</S.Notice> : null}
      {message ? <S.Notice>{message}</S.Notice> : null}

      <S.FormCard>
        <S.SectionHeader>
          <div>
            <S.Kicker>{editingProductId === null ? 'Adicionar' : 'Editar'}</S.Kicker>
            <h3>{editingProductId === null ? 'Novo item de menu' : `Editar item #${editingProductId}`}</h3>
          </div>
        </S.SectionHeader>

        <form onSubmit={handleSubmit}>
          <S.FieldGrid>
            <S.Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Nome do prato"
              required
            />
            <S.Input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
              placeholder="Preço"
              required
            />
          </S.FieldGrid>

          <S.ButtonRow>
            <S.PrimaryButton type="submit" disabled={saving}>
              {editingProductId === null ? 'Adicionar item' : 'Salvar alterações'}
            </S.PrimaryButton>
            {editingProductId !== null ? (
              <S.SecondaryButton
                type="button"
                onClick={() => {
                  setEditingProductId(null)
                  setForm(initialFormState)
                }}
              >
                Cancelar edição
              </S.SecondaryButton>
            ) : null}
          </S.ButtonRow>
        </form>
      </S.FormCard>

      <S.ProductGrid>
        {products.map((product) => (
          <S.ProductCard key={product.id}>
            <strong>{product.name}</strong>
            <span>{moneyFormatter.format(Number(product.price))}</span>

            <S.ProductActions>
              <S.SecondaryButton type="button" onClick={() => handleEdit(product)}>
                Editar
              </S.SecondaryButton>
              <S.DangerButton type="button" onClick={() => void handleDelete(product.id)}>
                Remover
              </S.DangerButton>
            </S.ProductActions>
          </S.ProductCard>
        ))}
      </S.ProductGrid>

      {!loading && products.length === 0 ? (
        <S.EmptyState>
          Nenhum item de menu cadastrado ainda.
        </S.EmptyState>
      ) : null}
    </S.Section>
  )
}

export default ManagerMenu