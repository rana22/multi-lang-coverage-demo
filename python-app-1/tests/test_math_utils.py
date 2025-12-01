from src.app.math_utils import add, normalize_scores


def test_add_basic():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(2.5, 0.5) == 3.0


def test_normalize_scores_empty():
    assert normalize_scores([]) == []


def test_normalize_scores_constant():
    scores = [5, 5, 5]
    assert normalize_scores(scores) == [0.0, 0.0, 0.0]


def test_normalize_scores_range():
    scores = [0, 50, 100]
    normalized = normalize_scores(scores)
    assert normalized[0] == 0.0
    assert normalized[-1] == 1.0
    assert 0.4 < normalized[1] < 0.6
