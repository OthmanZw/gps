using UnityEngine;

[CreateAssetMenu(fileName = "Level", menuName = "ColorQuest/Level Data")]
public class LevelData : ScriptableObject
{
    [System.Serializable]
    public struct ColorTarget
    {
        public Color color;
        public int quantity;
    }

    [Header("Level Settings")]
    public int levelNumber;
    public int movesLimit = 10;
    public int baseScore = 1000;
    
    [Header("Color Targets")]
    public ColorTarget[] colorTargets;
    
    [Header("Initial Setup")]
    public Color[] initialColors;
    public Vector2Int gridSize = new Vector2Int(3, 3);
    
    [Header("Level Requirements")]
    public int starsRequirement1 = 1000;
    public int starsRequirement2 = 2000;
    public int starsRequirement3 = 3000;
} 