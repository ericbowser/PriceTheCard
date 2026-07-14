/**
 * PriceTheCard — Feature Demo
 *
 * Records a walkthrough of the full workflow:
 *   profile creation → card search → add to library → set grid → drill-down → export
 *
 * Prerequisites:
 *   1. Dev server running:  npm run dev
 *   2. Run this spec:       npm run cypress:run
 *
 * Video output: cypress/videos/demo.cy.js.mp4
 */

describe('PriceTheCard Feature Demo', () => {
  beforeEach(() => {
    // Start every run with a clean slate so the profile picker shows
    cy.clearLocalStorage()
  })

  it('creates a profile, searches cards, builds a library, and explores by set', () => {

    // ── 1. App loads — profile picker ────────────────────────
    cy.visit('/')
    cy.contains('h1', 'PriceTheCard').should('be.visible')
    cy.wait(800)

    // ── 2. Create a profile ───────────────────────────────────
    cy.get('input[placeholder="Your name"]').type('Eric')
    cy.wait(500)
    cy.contains('button', 'Start').click()
    cy.wait(800)

    // ── 3. Main app is now active ─────────────────────────────
    cy.contains('h1', 'MTG Collection Manager').should('be.visible')
    cy.contains("Eric's collection").should('be.visible')
    cy.wait(600)

    // ── 4. Search for Lightning Bolt ──────────────────────────
    cy.get('input[placeholder*="Enter card name"]').type('Lightning Bolt')
    cy.wait(300)
    cy.contains('button', 'Search').click()

    // Wait for Scryfall API response
    cy.contains(/Found \d+ printing/, { timeout: 20000 }).should('be.visible')
    cy.wait(1200)

    // ── 5. Add the first printing to the library ──────────────
    cy.get('tbody tr').first().within(() => {
      cy.contains('button', 'Add to Library').click()
    })
    cy.contains('✓ Added', { timeout: 8000 }).should('be.visible')
    cy.wait(800)

    // ── 6. Search a second card ───────────────────────────────
    cy.get('input[placeholder*="Enter card name"]').type('Counterspell')
    cy.wait(300)
    cy.contains('button', 'Search').click()

    cy.contains(/Found \d+ printing/, { timeout: 20000 }).should('be.visible')
    cy.wait(1200)

    // ── 7. Add it too ─────────────────────────────────────────
    cy.get('tbody tr').first().within(() => {
      cy.contains('button', 'Add to Library').click()
    })
    cy.contains('✓ Added', { timeout: 8000 }).should('be.visible')
    cy.wait(800)

    // ── 8. Search a third card ────────────────────────────────
    cy.get('input[placeholder*="Enter card name"]').type('Dark Ritual')
    cy.wait(300)
    cy.contains('button', 'Search').click()

    cy.contains(/Found \d+ printing/, { timeout: 20000 }).should('be.visible')
    cy.wait(1000)

    cy.get('tbody tr').first().within(() => {
      cy.contains('button', 'Add to Library').click()
    })
    cy.wait(800)

    // ── 9. Reveal the library section ─────────────────────────
    cy.scrollTo('bottom', { duration: 1000, easing: 'swing' })
    cy.wait(1000)

    cy.contains("Eric's Library").should('be.visible')
    cy.wait(1000)

    // ── 10. Drill into the first set tile ─────────────────────
    cy.get('.grid button').first().click()
    cy.wait(800)
    cy.contains('← All Sets').should('be.visible')

    // Let card images load and settle
    cy.wait(3000)

    // ── 11. Navigate back to the set overview ─────────────────
    cy.contains('← All Sets').click()
    cy.wait(800)

    // ── 12. Scroll back up and export ─────────────────────────
    cy.scrollTo('top', { duration: 800, easing: 'swing' })
    cy.wait(600)

    cy.contains('button', 'Export CSV').should('not.be.disabled').click()
    cy.wait(800)

    // ── Done ──────────────────────────────────────────────────
    // Video saved to: cypress/videos/demo.cy.js.mp4
  })
})
