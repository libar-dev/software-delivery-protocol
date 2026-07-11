# A realistic vanilla-Cucumber feature file — the INPUT to `sdp import`.
# Deliberately messy in the ways real corpora are: conventional tags with no
# delivery meaning, a Background, Rule blocks, a plain Scenario with inline
# values, and a Scenario Outline with an Examples table.

@orders @smoke
Feature: Create order
  As a customer I want my cart to become an order
  so that I can complete my purchase.

  Background:
    Given a signed-in customer

  Rule: A valid cart becomes an order

    Scenario: Valid cart creates an order
      Given a cart with 2 line items
      And every cart item is in stock
      When the customer submits the cart for order creation
      Then an order is created
      And the order total equals the cart total

    Scenario Outline: Order total reflects quantity and unit price
      Given a cart with <qty> units of a <price> item
      When the customer submits the cart for order creation
      Then the order total is <total>

      Examples:
        | qty | price | total |
        | 1   | 50    | 50    |
        | 3   | 20    | 60    |

  Rule: Invalid carts are rejected

    Scenario: Empty cart is rejected
      Given an empty cart
      When the customer submits the cart for order creation
      Then no order is created
      And the customer sees "empty cart"
