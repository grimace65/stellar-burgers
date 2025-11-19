describe('Burger Constructor', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
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
        cy.contains('Краторная булка')
        .parent()
        .find('button')
        .click();
        cy.get('[data-testid=constructor-bun]').first().within(() => {
            cy.contains('Краторная булка').should('exist');
        });
        
    });
    it('добавляет начинку в конструктор', () => {
        cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .click();
        cy.get('[data-testid=constructor-item]').first().within(() => {
            cy.contains('Биокотлета из марсианской Магнолии').should('exist');
        });
    });
    it('открывает модальное окно при клике на ингредиент', () => {
        cy.contains('Краторная').click();
        cy.get('[data-testid=item-modal]').should('be.visible');
        cy.get('[data-testid=item-modal]').first().within(() => {
        cy.contains('Детали ингредиента').should('exist');
        cy.contains('Калории').should('exist');
        cy.contains('Белки').should('exist');
        cy.contains('Жиры').should('exist');
        cy.contains('Углеводы').should('exist');
    });
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
        cy.contains('Краторная булка').parent().find('button').click();
        cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').click();
        cy.get('[data-testid=constructor-bun]').first().within(() => {
            cy.contains('Краторная булка').should('exist');
        });
        cy.get('[data-testid=constructor-item]').first().within(() => {
            cy.contains('Биокотлета из марсианской Магнолии').should('exist');
        });
    });
    it('оформляет заказ для авторизованного пользователя', () => {
        cy.setCookie('accessToken', 'fake-token');
        localStorage.setItem('refreshToken', 'fake-refresh-token');

        cy.contains('Краторная булка').parent().find('button').click();
        cy.contains('Биокотлета из марсианской Магнолии').parent().find('button').click();
        cy.contains('button', 'Оформить заказ').click();
        cy.wait('@createOrder');
        cy.get('[data-testid=order-modal]').first().within(() => {
            cy.contains('12345').should('exist');
            cy.contains('идентификатор заказа').should('exist');
        });
        cy.get('[data-testid=close-button]').click();

        cy.get('[data-testid=burger-bun]').first().within(() => {
            cy.contains('Выберите булки').should('exist');
        });

        cy.get('[data-testid=constructor-item]').first().within(() => {
            cy.contains('Выберите начинку').should('exist');
        });
    })
})