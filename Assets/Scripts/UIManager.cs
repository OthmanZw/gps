using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class UIManager : MonoBehaviour
{
    public static UIManager Instance { get; private set; }

    [Header("Panels")]
    public GameObject mainMenuPanel;
    public GameObject gamePanel;
    public GameObject pausePanel;
    public GameObject levelCompletePanel;
    public GameObject gameOverPanel;

    [Header("Game UI")]
    public TextMeshProUGUI levelText;
    public TextMeshProUGUI scoreText;
    public TextMeshProUGUI movesText;
    public TextMeshProUGUI timerText;

    [Header("Level Complete")]
    public TextMeshProUGUI levelCompleteScore;
    public TextMeshProUGUI levelCompleteStars;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        // S'abonner aux événements du GameManager
        GameManager.Instance.OnGamePaused += ShowPausePanel;
        GameManager.Instance.OnGameResumed += HidePausePanel;
        GameManager.Instance.OnLevelCompleted += ShowLevelComplete;

        ShowMainMenu();
    }

    public void ShowMainMenu()
    {
        HideAllPanels();
        mainMenuPanel.SetActive(true);
    }

    public void StartGame()
    {
        HideAllPanels();
        gamePanel.SetActive(true);
        UpdateUI();
    }

    public void ShowPausePanel()
    {
        pausePanel.SetActive(true);
    }

    public void HidePausePanel()
    {
        pausePanel.SetActive(false);
    }

    public void ShowLevelComplete()
    {
        levelCompletePanel.SetActive(true);
        levelCompleteScore.text = "Score: " + GameManager.Instance.TotalScore.ToString();
        // TODO: Implémenter le calcul des étoiles
    }

    public void ShowGameOver()
    {
        gameOverPanel.SetActive(true);
    }

    public void UpdateUI()
    {
        levelText.text = "Niveau " + GameManager.Instance.CurrentLevel.ToString();
        scoreText.text = "Score: " + GameManager.Instance.TotalScore.ToString();
        // Les mouvements et le timer seront mis à jour par le LevelManager
    }

    private void HideAllPanels()
    {
        mainMenuPanel.SetActive(false);
        gamePanel.SetActive(false);
        pausePanel.SetActive(false);
        levelCompletePanel.SetActive(false);
        gameOverPanel.SetActive(false);
    }

    private void OnDestroy()
    {
        if (GameManager.Instance != null)
        {
            GameManager.Instance.OnGamePaused -= ShowPausePanel;
            GameManager.Instance.OnGameResumed -= HidePausePanel;
            GameManager.Instance.OnLevelCompleted -= ShowLevelComplete;
        }
    }
} 