import styles from './Pagination.module.css'

export function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null
  const { current_page, last_page } = meta

  const pages = []
  for (let i = 1; i <= last_page; i++) {
    if (i === 1 || i === last_page || Math.abs(i - current_page) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        disabled={current_page === 1}
        onClick={() => onPageChange(current_page - 1)}
      >‹ Préc.</button>

      {pages.map((p, i) =>
        p === '...'
          ? <span key={i} className={styles.ellipsis}>…</span>
          : <button
              key={p}
              className={`${styles.btn} ${p === current_page ? styles.active : ''}`}
              onClick={() => onPageChange(p)}
            >{p}</button>
      )}

      <button
        className={styles.btn}
        disabled={current_page === last_page}
        onClick={() => onPageChange(current_page + 1)}
      >Suiv. ›</button>
    </div>
  )
}
