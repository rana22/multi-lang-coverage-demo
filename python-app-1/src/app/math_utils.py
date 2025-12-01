def add(a: float, b: float) -> float:
    return a + b


def normalize_scores(scores):
    """
    Normalize a list of numeric scores to [0, 1].
    Returns [] for empty input.
    """
    if not scores:
        return []

    mn = min(scores)
    mx = max(scores)
    if mx == mn:
        return [0.0 for _ in scores]

    return [(s - mn) / (mx - mn) for s in scores]

