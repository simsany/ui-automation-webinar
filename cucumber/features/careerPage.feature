Feature: EPAM job searching
  As a Job searcher
  I want to browser through EPAM Job offers by various criteria
  So I can find to best fitting offer for me

  Scenario Outline: I search for a job

    Given I navigate to the career page
    Then I want to see the career page
    And I want to see the search form

    Given I am on the career page
    When I click on the Location filter box
    Then I want to see the country: "<country>" in the list
    And I want to see the city: "<city>" in the list

    When I click on the country: "<country>"
    Then the "<country>"'s city list gets visible
    And the "<country>"'s city list contains "<city>"

    When I click on the city: "<city>" label
    Then the dropdown menu closes
    And the "<city>" name is shown in the location field

    When I click on the Skills filter box
    Then I want to see the available departments
    And I want to see the given department: "<department>"

    When I click on the department: "<department>"'s label
    Then I want the "<department>"'s checkbox to be checked

    When I click on the button: find button
    Then I want to see the job listing page
    And I want to see the position: "<position>"
    And I want the position to have the location "<city>" and "<country>"
    And I want the position to have apply button

    When I click on the button: apply button
    Then I want to see the job description page
    And I want to see the city: "<city>" in the job description
    And I want to see the position: "<position>" in the job description




    Examples:
      | country | city     | department                | position                      |
      | Hungary | Debrecen | Software Test Engineering | Lead Test Automation Engineer |
      | Belarus | Minsk    | Software Architecture     | Test Automation Architect     |
