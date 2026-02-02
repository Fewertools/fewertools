#!/usr/bin/env python3
"""
Kelly Criterion Calculator for Sports Betting
Run: python3 kelly-calculator.py
"""

def decimal_to_implied(odds):
    """Convert decimal odds to implied probability"""
    return (1 / odds) * 100

def american_to_implied(odds):
    """Convert American odds to implied probability"""
    if odds > 0:
        return (100 / (odds + 100)) * 100
    else:
        return (abs(odds) / (abs(odds) + 100)) * 100

def kelly_stake(odds, probability, fraction=0.25):
    """
    Calculate Kelly criterion stake
    
    Args:
        odds: Decimal odds (e.g., 2.50)
        probability: Your estimated probability (e.g., 0.50 for 50%)
        fraction: Kelly fraction (default 0.25 for Quarter Kelly)
    
    Returns:
        Recommended stake as percentage of bankroll
    """
    b = odds - 1
    p = probability
    q = 1 - p
    
    kelly = (b * p - q) / b
    
    if kelly <= 0:
        return 0
    
    return kelly * fraction * 100

def calculate_value(your_prob, implied_prob):
    """Calculate edge/value percentage"""
    return your_prob - implied_prob

def main():
    print("\n" + "="*50)
    print("  KELLY CRITERION CALCULATOR")
    print("  Sports Betting Stake Sizing")
    print("="*50 + "\n")
    
    # Get odds
    print("Enter odds format:")
    print("1. Decimal (e.g., 2.50)")
    print("2. American (e.g., +150 or -200)")
    
    format_choice = input("\nChoice (1/2): ").strip()
    
    if format_choice == "1":
        odds = float(input("Enter decimal odds: "))
        implied = decimal_to_implied(odds)
    elif format_choice == "2":
        american = int(input("Enter American odds: "))
        implied = american_to_implied(american)
        # Convert to decimal for Kelly calculation
        if american > 0:
            odds = (american / 100) + 1
        else:
            odds = (100 / abs(american)) + 1
    else:
        print("Invalid choice")
        return
    
    print(f"\n→ Implied probability: {implied:.1f}%")
    
    # Get your probability
    your_prob_pct = float(input("\nYour estimated probability (%): "))
    your_prob = your_prob_pct / 100
    
    # Calculate value
    edge = calculate_value(your_prob_pct, implied)
    
    print("\n" + "-"*50)
    print("ANALYSIS")
    print("-"*50)
    
    print(f"Implied probability:   {implied:.1f}%")
    print(f"Your probability:      {your_prob_pct:.1f}%")
    print(f"Edge/Value:            {edge:+.1f}%")
    
    if edge < 5:
        print(f"\n⚠️  EDGE TOO SMALL ({edge:.1f}% < 5%)")
        print("   Recommendation: NO BET")
        return
    
    # Calculate Kelly stakes
    full_kelly = kelly_stake(odds, your_prob, fraction=1.0)
    half_kelly = kelly_stake(odds, your_prob, fraction=0.5)
    quarter_kelly = kelly_stake(odds, your_prob, fraction=0.25)
    
    print("\n" + "-"*50)
    print("STAKE RECOMMENDATION")
    print("-"*50)
    
    print(f"Full Kelly:    {full_kelly:.2f}% of bankroll")
    print(f"Half Kelly:    {half_kelly:.2f}% of bankroll")
    print(f"Quarter Kelly: {quarter_kelly:.2f}% of bankroll ← RECOMMENDED")
    
    # Bankroll calculation
    bankroll = input("\nEnter your bankroll (or press Enter to skip): £")
    
    if bankroll:
        bankroll = float(bankroll)
        stake = bankroll * (quarter_kelly / 100)
        potential_return = stake * odds
        potential_profit = potential_return - stake
        
        print("\n" + "-"*50)
        print("YOUR BET")
        print("-"*50)
        print(f"Stake:           £{stake:.2f}")
        print(f"Potential Return: £{potential_return:.2f}")
        print(f"Potential Profit: £{potential_profit:.2f}")
    
    # Confidence check
    print("\n" + "-"*50)
    print("CONFIDENCE LEVEL")
    print("-"*50)
    
    if edge >= 20:
        conf = "MAXIMUM (5 units max)"
    elif edge >= 13:
        conf = "HIGH (3 units)"
    elif edge >= 8:
        conf = "MEDIUM (2 units)"
    else:
        conf = "LOW (1 unit)"
    
    print(f"Based on {edge:.1f}% edge: {conf}")
    
    print("\n" + "="*50)
    print("  Remember: Discipline IS the edge.")
    print("="*50 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nExiting...")
    except ValueError as e:
        print(f"\nError: Invalid input. Please enter numbers only.")
