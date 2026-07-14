/**
 * PriceTheCard — Feature Demo
 *
 * Records a walkthrough of the full workflow:
 *   card search → card zoom → add to library → set grid → drill-down → card zoom in library → export
 *
 * Prerequisites:
 *   1. Dev server running:  npm run dev
 *   2. Run this spec:       npm run cypress:run
 *
 * Video output: cypress/videos/demo.cy.js.mp4
 */

describe('PriceTheCard Feature Demo', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('searches cards, zooms images, builds a library, and explores by set', () => {

    // ── 1. App loads ──────────────────────────────────────────
    cy.visit('/')
    cy.contains('h1', 'MTG Collection Manager').should('be.visible')
    cy.wait(1000)

    // ── 2. Search for Lightning Bolt ──────────────────────────
    cy.get('input[placeholder*="Enter card name"]').type('Lightning Bolt')
    cy.wait(400)
    cy.contains('button', 'Search').click()
    cy.contains(/Found \d+ printing/, { timeout: 20000 }).should('be.visible')
    cy.wait(1200)

    // ── 3. Select a printing to reveal the card detail view ───
    cy.get('tbody tr').first().click()
    cy.wait(1000)

    // ── 4. Demo the magnify button on the selected card ───────
    cy.get('img[alt="Lightning Bolt"]').first().trigger('mouseover')
    cy.wait(600)
    cy.contains('button[title="Enlarge card"]', '🔍').click({ force: true })
    cy.wait(1500)

    // Close the zoom modal
    cy.get('button').contains('✕').click()
    cy.wait(800)

    // ── 5. Add Lightning Bolt to library ──────────────────────
    cy.get('tbody tr').first().within(() => {
      cy.contains('button', 'Add to Library').click()
    })
    cy.contains('✓ Added', { timeout: 8000 }).should('be.visible')
    cy.wait(800)

    // ── 6. Search Counterspell ────────────────────────────────
    cy.get('input[placeholder*="Enter card name"]').type('Counterspell')
    cy.wait(400)
    cy.contains('button', 'Search').click()
    cy.contains(/Found \d+ printing/, { timeout: 20000 }).should('be.visible')
    cy.wait(1200)

    cy.get('tbody tr').first().within(() => {
      cy.contains('button', 'Add to Library').click()
    })
    cy.contains('✓ Added', { timeout: 8000 }).should('be.visible')
    cy.wait(800)

    // ── 7. Search Dark Ritual ─────────────────────────────────
    cy.get('input[placeholder*="Enter card name"]').type('Dark Ritual')
    cy.wait(400)
    cy.contains('button', 'Search').click()
    cy.contains(/Found \d+ printing/, { timeout: 20000 }).should('be.visible')
    cy.wait(1000)

    cy.get('tbody tr').first().within(() => {
      cy.contains('button', 'Add to Library').click()
    })
    cy.wait(800)

    // ── 8. Library is already open — scroll down to set grid ─
    cy.scrollTo('bottom', { duration: 1000, easing: 'swing', ensureScrollable: false })
    cy.wait(1500)

    cy.contains('h2', 'Your Library').should('be.visible')
    cy.wait(1000)

    // ── 9. Drill into the first set tile ──────────────────────
    cy.get('.grid button').first().click()
    cy.wait(800)
    cy.contains('← All Sets').should('be.visible')
    cy.wait(3000) // Let card images load

    // ── 10. Demo the magnify button on a library card ─────────
    cy.get('.relative.group').first().trigger('mouseover')
    cy.wait(600)
    cy.get('button[title="Enlarge"]').first().click({ force: true })
    cy.wait(2000)

    // Close the zoom modal
    cy.get('button').contains('✕').click()
    cy.wait(800)

    // ── 11. Back to set overview ──────────────────────────────
    cy.contains('← All Sets').click()
    cy.wait(800)

    // ── 12. Scroll up and export ──────────────────────────────
    cy.scrollTo('top', { duration: 800, easing: 'swing', ensureScrollable: false })
    cy.wait(600)
    cy.contains('button', 'Export CSV').should('not.be.disabled').click()
    cy.wait(800)

    // ── Done ──────────────────────────────────────────────────
    // Video saved to: cypress/videos/demo.cy.js.mp4
  })
})
