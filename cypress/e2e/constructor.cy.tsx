describe('Burger Constructor', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
        cy.intercept('GET', '**/api/auth/user', {
            success: true,
            user: {
              email: "jackson@mail.ru",
              name: "michael jackson"
            }
        }).as('getUser');
        cy.intercept('POST', '**/api/orders', {
            success: true,
            name: "Space бургер",
            order: {
              number: 12345
            }
        }).as('createOrder');
        cy.setCookie('accessToken', 'test-token');
        cy.visit('http://localhost:4000');
        cy.wait('@getIngredients');
    });
    it('добавляет булку в конструктор', () => {
        cy.contains('button', 'Добавить').first().click();
        cy.get('[data-testid=constructor-bun]').should('exist');
    });
    it('добавляет начинку в конструктор', () => {
        cy.get('button:contains("Добавить")').eq(1).click();
        cy.get('[data-testid=constructor-item]').should('exist');
    });
    it('открывает модальное окно при клике на ингредиент', () => {
        cy.contains('Краторная').click();
        cy.get('[data-testid=item-modal]').should('exist');
    })
    it('закрывает модальное окно при нажатии на крестик', () => {
        cy.contains('Краторная').click();
        cy.get('[data-testid=item-modal]').should('exist');
        cy.get('[data-testid=close-button]').click();
        cy.get('[data-testid=item-modal]').should('not.exist');
    })
    it('закрывает модально окно при клике на оверлей', () => {
        cy.contains('Краторная').click();
        cy.get('[data-testid=item-modal]').should('exist');
        cy.get('[data-testid=modal-overlay]').click({ force: true });
        cy.get('[data-testid=item-modal]').should('not.exist');
    })
    it('собирает бургер', () => {
        cy.contains('button', 'Добавить').first().click();
        cy.get('button:contains("Добавить")').eq(1).click();
        cy.get('[data-testid=constructor-bun]').should('exist');
        cy.get('[data-testid=constructor-item]').should('exist');
    })
    it('оформляет заказ для авторизованного пользователя', () => {
        cy.contains('button', 'Добавить').first().click();
        cy.get('button:contains("Добавить")').eq(1).click();
        cy.get('[data-testid=constructor-bun]').should('exist');
        cy.get('[data-testid=constructor-item]').should('exist');
        cy.contains('button', 'Оформить заказ').should('not.be.disabled');
        cy.contains('button', 'Оформить заказ').click();
        cy.wait('@createOrder');
        cy.get('[data-testid=order-modal]').should('exist');
        cy.contains('12345').should('exist');
        cy.get('[data-testid=close-button]').click();
        cy.get('[data-testid=item-modal]').should('not.exist');
        cy.get('[data-testid=constructor-bun]').should('not.exist');
        cy.contains('Выберите булки').should('exist');
        cy.get('[data-testid=constructor-item]').within(() => {
            cy.contains('Выберите начинку').should('exist');
        });
    })
})