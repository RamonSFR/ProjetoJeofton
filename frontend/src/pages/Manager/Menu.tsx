import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useOutletContext } from 'react-router-dom'

import {
  createProduct,
  deleteProduct,
  getRestaurantProducts,
  updateProduct
} from '../../lib/api'
import type { ProductRecord } from '../../types/api'

import { type ManagerRestaurantContext } from './RestaurantWorkspace'
import * as S from './styles'

type ProductFormState = {
  name: string
  price: string
}

type FeedbackState = {
  type: 'success' | 'error'
  message: string
} | null

const initialFormState: ProductFormState = {
  name: '',
  price: ''
}

const ManagerMenu = () => {
  const { restaurant } = useOutletContext<ManagerRestaurantContext>()
  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  )

  const [products, setProducts] = useState<ProductRecord[]>([])
  const [form, setForm] = useState<ProductFormState>(initialFormState)
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState<FeedbackState>(null)

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
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to load menu.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant.id])

  useEffect(() => {
    if (!isModalOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => window.removeEventListener('keydown', handleEscape)
  }, [isModalOpen])

  const openAddModal = () => {
    setEditingProductId(null)
    setForm(initialFormState)
    setError('')
    setFeedback(null)
    setIsModalOpen(true)
  }

  const openEditModal = (product: ProductRecord) => {
    setEditingProductId(product.id)
    setForm({
      name: product.name,
      price: String(product.price)
    })
    setError('')
    setFeedback(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsedPrice = Number(form.price)

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setFeedback({
        type: 'error',
        message: 'O preço do prato precisa ser maior que zero.'
      })
      return
    }

    try {
      setSaving(true)
      setError('')

      if (editingProductId === null) {
        await createProduct(restaurant.id, {
          name: form.name.trim(),
          price: parsedPrice
        })
        setFeedback({
          type: 'success',
          message: 'Produto criado com sucesso.'
        })
      } else {
        await updateProduct(restaurant.id, editingProductId, {
          name: form.name.trim(),
          price: parsedPrice
        })
        setFeedback({
          type: 'success',
          message: 'Produto atualizado com sucesso.'
        })
      }

      await loadProducts()

      if (editingProductId === null) {
        setForm(initialFormState)
      }

      setEditingProductId(null)
    } catch (saveError) {
      setFeedback({
        type: 'error',
        message:
          saveError instanceof Error
            ? saveError.message
            : 'Unable to save product.'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId: number) => {
    try {
      setSaving(true)
      setFeedback(null)
      await deleteProduct(restaurant.id, productId)
      await loadProducts()
      setFeedback({
        type: 'success',
        message: 'Produto removido.'
      })
    } catch (deleteError) {
      setFeedback({
        type: 'error',
        message:
          deleteError instanceof Error
            ? deleteError.message
            : 'Unable to delete product.'
      })
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
        <S.ToolbarActions>
          <span>{loading ? 'Carregando...' : `${products.length} itens`}</span>
          <S.AddButton type="button" onClick={openAddModal}>
            Adicionar
          </S.AddButton>
        </S.ToolbarActions>
      </S.Toolbar>

      {error ? <S.Notice>{error}</S.Notice> : null}

      {isModalOpen ? (
        <S.ModalOverlay onClick={closeModal} role="presentation">
          <S.ModalDialog
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <S.ModalHeader>
              <div>
                <S.Kicker>
                  {editingProductId === null ? 'Adicionar' : 'Editar'}
                </S.Kicker>
                <h3>
                  {editingProductId === null
                    ? 'Novo item de menu'
                    : `Editar item #${editingProductId}`}
                </h3>
              </div>

              <S.ModalCloseButton
                type="button"
                onClick={closeModal}
                aria-label="Fechar modal"
              >
                ×
              </S.ModalCloseButton>
            </S.ModalHeader>

            <S.ModalForm onSubmit={handleSubmit}>
              {feedback ? (
                <S.FeedbackBanner
                  $variant={feedback.type}
                  role="status"
                  aria-live="polite"
                >
                  {feedback.message}
                </S.FeedbackBanner>
              ) : null}

              <S.FieldGrid>
                <S.Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value
                    }))
                  }
                  placeholder="Nome do prato"
                  required
                />
                <S.Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      price: event.target.value
                    }))
                  }
                  placeholder="Preço"
                  required
                />
              </S.FieldGrid>

              <S.ButtonRow>
                <S.PrimaryButton type="submit" disabled={saving}>
                  {editingProductId === null
                    ? 'Adicionar item'
                    : 'Salvar alterações'}
                </S.PrimaryButton>
                <S.SecondaryButton type="button" onClick={closeModal}>
                  Cancelar
                </S.SecondaryButton>
              </S.ButtonRow>
            </S.ModalForm>
          </S.ModalDialog>
        </S.ModalOverlay>
      ) : null}

      <S.ProductGrid>
        {products.map((product) => (
          <S.ProductCard key={product.id}>
            <strong>{product.name}</strong>
            <span>{moneyFormatter.format(Number(product.price))}</span>

            <S.ProductActions>
              <S.SecondaryButton
                type="button"
                onClick={() => openEditModal(product)}
              >
                Editar
              </S.SecondaryButton>
              <S.DangerButton
                type="button"
                onClick={() => void handleDelete(product.id)}
              >
                Remover
              </S.DangerButton>
            </S.ProductActions>
          </S.ProductCard>
        ))}
      </S.ProductGrid>

      {!loading && products.length === 0 ? (
        <S.EmptyState>Nenhum item de menu cadastrado ainda.</S.EmptyState>
      ) : null}
    </S.Section>
  )
}

export default ManagerMenu
