import { parseConceptMapCaption } from "./parse-concept-map";

export type LessonDiagramType =
  | "parabola"
  | "integral_area"
  | "coordinate_axes"
  | "exponential_graph"
  | "chemistry_reaction"
  | "particulate_matter"
  | "physics_spacetime"
  | "biology_evolution"
  | "concept_map"
  | "concept_board"
  | "generic";

/**
 * Infers which SVG diagram to render from a diagram caption.
 */
export function detectDiagramType(caption: string): LessonDiagramType {
  if (parseConceptMapCaption(caption)) {
    return "concept_map";
  }

  const text = caption.toLowerCase();

  if (
    /粒子|particulate|固体|liquid|gas|三态|晶格|lattice|kinetic theory|扩散|diffusion|布朗|brownian|状态|states of matter|振动|vibrat|紧密堆积|排列/.test(
      text
    )
  ) {
    return "particulate_matter";
  }

  if (
    /进化|演化|evolution|自然选择|natural selection|物种|speciation|系统发育|phylogen|进化树|cladogram|共同祖先|common ancestor/.test(
      text
    )
  ) {
    return "biology_evolution";
  }

  if (
    /物理|physics|相对论|relativity|einstein|爱因斯坦|时间膨胀|time dilation|洛伦兹|lorentz|时空|spacetime|参考系|reference frame/.test(
      text
    )
  ) {
    return "physics_spacetime";
  }

  if (
    /化学|反应|chemistry|reaction|分子|molecule|催化剂|catalyst|试剂|reagent|氧化|还原|oxid|reduc|焓|enthalpy|能量图|energy (profile|diagram)|反应条件|reaction condition/.test(
      text
    )
  ) {
    return "chemistry_reaction";
  }

  if (
    /积分|曲边|面积|integral|antiderivative|原函数|牛顿|leibniz|ftc|定积分/.test(
      text
    )
  ) {
    return "integral_area";
  }

  if (
    /抛物线|二次函数|quadratic|parabola|vertex|顶点|对称轴|x\s*截|x-?intercept/.test(
      text
    )
  ) {
    return "parabola";
  }

  if (
    /指数函数|对数函数|exponential|logarithm|log_a|a\^x|底数|单调性|增函数|减函数/.test(
      text
    )
  ) {
    return "exponential_graph";
  }

  if (
    /坐标系|坐标平面|函数图像|函数图|xy-?plane|coordinate plane|plot (the )?function|sketch (the )?graph/.test(
      text
    )
  ) {
    return "coordinate_axes";
  }

  if (
    /历史|朝代|timeline|时间线|生物|细胞|cell|photosynth|光合|物理|电路|circuit|力|force|实验步骤|process|流程|因素|condition/.test(
      text
    )
  ) {
    return "concept_board";
  }

  return "concept_board";
}
