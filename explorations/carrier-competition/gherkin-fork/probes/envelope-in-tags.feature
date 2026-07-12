# A realistic vanilla-Cucumber feature file, re-annotated for the compatible
# Gherkin-fork probe. The original @orders and @smoke tags remain intact.
#
# Stock Gherkin accepts every @sdp tag below, but reads each one only as an
# opaque tag name. Giving the names Protocol meaning requires another parser.

@orders @smoke
@sdp
@id:spec:orders.create-order
@kind:behavior
@altitude:feature
@readiness:scoped
@refines:spec:orders.order-management
Feature: Create order
  As a customer I want my cart to become an order
  so that I can complete my purchase.

  Background:
    Given a signed-in customer

  @sdp
  @id:spec:orders.create-order.valid-cart-becomes-an-order
  @kind:rule
  @altitude:story
  @readiness:scoped
  @refines:spec:orders.create-order
  Rule: A valid cart becomes an order

    @sdp
    @id:spec:orders.create-order.valid-cart-creates-an-order
    @kind:example
    @altitude:story
    @readiness:scoped
    @refines:spec:orders.create-order.valid-cart-becomes-an-order
    Scenario: Valid cart creates an order
      Given a cart with 2 line items
      And every cart item is in stock
      When the customer submits the cart for order creation
      Then an order is created
      And the order total equals the cart total

    # This is the compatible encoding's structural dead end. One tag set can
    # describe the whole outline, but the two rows below cannot each carry an
    # authored Spec identity. Treating the outline as one example would break
    # the point-per-example law; deriving row identities needs another
    # convention outside the stock grammar.
    @sdp
    @id:spec:orders.create-order.order-total
    @kind:example
    @altitude:story
    @readiness:scoped
    @refines:spec:orders.create-order.valid-cart-becomes-an-order
    @slot:qty:number @slot:price:number @slot:total:number
    Scenario Outline: Order total reflects quantity and unit price
      Given a cart with <qty> units of a <price> item
      When the customer submits the cart for order creation
      Then the order total is <total>

      Examples:
        | qty | price | total |
        | 1   | 50    | 50    |
        | 3   | 20    | 60    |

  @sdp
  @id:spec:orders.create-order.invalid-carts-are-rejected
  @kind:rule
  @altitude:story
  @readiness:scoped
  @refines:spec:orders.create-order
  Rule: Invalid carts are rejected

    @sdp
    @id:spec:orders.create-order.empty-cart-is-rejected
    @kind:example
    @altitude:story
    @readiness:scoped
    @refines:spec:orders.create-order.invalid-carts-are-rejected
    Scenario: Empty cart is rejected
      Given an empty cart
      When the customer submits the cart for order creation
      Then no order is created
      And the customer sees "empty cart"
