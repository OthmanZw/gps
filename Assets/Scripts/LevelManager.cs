using UnityEngine;
using System.Collections.Generic;

public class LevelManager : MonoBehaviour
{
    [System.Serializable]
    public class LevelData
    {
        public Color[] targetColors;
        public int movesLimit;
        public int scoreTarget;
    }

    public LevelData[] levels;
    private List<ColorElement> activeElements;
    private ColorElement selectedElement;
    private int currentMoves;
    private int currentScore;

    private void Start()
    {
        activeElements = new List<ColorElement>();
        InitializeLevel(GameManager.Instance.CurrentLevel);
        ColorElement.OnElementClicked += HandleElementClick;
    }

    private void InitializeLevel(int levelIndex)
    {
        if (levelIndex <= 0 || levelIndex > levels.Length)
        {
            Debug.LogError("Niveau invalide!");
            return;
        }

        currentMoves = 0;
        currentScore = 0;
        ClearLevel();
        SetupLevel(levels[levelIndex - 1]);
    }

    private void SetupLevel(LevelData levelData)
    {
        // TODO: Instancier les éléments de couleur selon le niveau
        // Cette partie sera implémentée une fois que nous aurons les prefabs
    }

    private void HandleElementClick(ColorElement element)
    {
        if (selectedElement == null)
        {
            selectedElement = element;
        }
        else if (selectedElement != element)
        {
            // Mélanger les couleurs
            selectedElement.MixWith(element);
            currentMoves++;
            CheckLevelProgress();
            selectedElement = null;
        }
        else
        {
            selectedElement = null;
        }
    }

    private void CheckLevelProgress()
    {
        // Vérifier si le niveau est terminé
        bool levelCompleted = CheckColorMatches();
        
        if (levelCompleted)
        {
            CompleteLevel();
        }
        else if (currentMoves >= levels[GameManager.Instance.CurrentLevel - 1].movesLimit)
        {
            GameOver();
        }
    }

    private bool CheckColorMatches()
    {
        // TODO: Implémenter la vérification des correspondances de couleurs
        return false;
    }

    private void CompleteLevel()
    {
        CalculateScore();
        GameManager.Instance.CompleteLevel(currentScore);
        // TODO: Afficher l'écran de victoire
    }

    private void GameOver()
    {
        // TODO: Implémenter la logique de game over
    }

    private void CalculateScore()
    {
        LevelData currentLevelData = levels[GameManager.Instance.CurrentLevel - 1];
        int movesBonus = Mathf.Max(0, currentLevelData.movesLimit - currentMoves);
        currentScore = currentLevelData.scoreTarget + (movesBonus * 100);
    }

    private void ClearLevel()
    {
        foreach (var element in activeElements)
        {
            if (element != null)
            {
                Destroy(element.gameObject);
            }
        }
        activeElements.Clear();
    }

    private void OnDestroy()
    {
        ColorElement.OnElementClicked -= HandleElementClick;
    }
} 